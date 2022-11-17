export default function getMongoDBQueryFromUrl(
  urlQuery: string,
  allowedFields?: string[]
): { filter: { [key: string]: string | {} | {}[] }; options: { [key: string]: {} } } | null {
  const urlQueries = urlQuery.split("&");
  let filter: { [key: string]: string | {} | {}[] } = {};
  let options: { [key: string]: {} } = {};
  const orFilters: {}[][] = [];
  let orFilterIndex = 0;
  for (const query of urlQueries) {
    let queries: { [key: string]: string } = {};
    if (query.startsWith("(") && query.endsWith(")")) {
      const orQueries = query.slice(1, query.length - 1).split("|");
      for (const orQuery of orQueries) {
        const queryParts = orQuery.split("=");
        queries[queryParts[0]] = queryParts[1];
      }
    } else {
      const queryParts = query.split("=");
      queries[queryParts[0]] = queryParts[1];
    }

    for (const [key, value] of Object.entries(queries) as [string, string][]) {
      if (allowedFields && !allowedFields.includes(key)) {
        console.error("Invalid field, check that the allowed fields are correct");
        return null;
      }
      const queryInfo = getIndividualMongoDBQueryFromKeyValue(key, value);
      if (Object.entries(queries).length > 1) {
        if (!orFilters[orFilterIndex]) orFilters[orFilterIndex] = [];
        orFilters[orFilterIndex].push(queryInfo.query);
      } else {
        if (queryInfo.isOption) {
          options = { ...options, ...queryInfo.query };
        } else {
          filter = { ...filter, ...queryInfo.query };
        }
      }
    }
    orFilterIndex++;
  }

  if (orFilters.length > 0) filter["$and"] = orFilters.map((orFilter) => ({ $or: [...orFilter] }));

  return { filter: filter, options: options };
}

function getIndividualMongoDBQueryFromKeyValue(key: string, value: string): { query: { [key: string]: string | {} }; isOption: boolean } {
  const query: { [key: string]: string | {} } = {};
  let isOption = false;
  if (key.startsWith("$")) {
    const optionParams = (value as string).split(":");
    if (optionParams.length === 1) {
      query[key.replace("$", "")] = { [optionParams[0]]: parseInt(optionParams[1]) ?? optionParams[1] };
    } else {
      query[key.replace("$", "")] = optionParams[0];
    }
    isOption = true;
  } else {
    if (value.split(",").length > 1) {
      const values = value.split(",").map((value) => value.toLowerCase());
      query[key] = { $in: values };
    } else if (value.split("-").length === 2) {
      const values = value.split("-");
      query[key] = { $gte: parseInt(values[0]), $lte: parseInt(values[1]) };
    } else {
      query[key] = value.toLowerCase();
    }
  }
  return { query: query, isOption: isOption };
}
