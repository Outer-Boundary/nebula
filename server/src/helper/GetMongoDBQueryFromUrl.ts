export default function getMongoDBQueryFromUrl(
  urlQuery: string,
  allowedFields?: string[]
): { filter: { [key: string]: string | {} | {}[] }; options: { [key: string]: {} } } | null {
  const urlQueries = urlQuery.split("&");
  let filter: { [key: string]: string | {} | {}[] } = {};
  let options: { [key: string]: {} } = {};
  const orFilters: {}[][] = [];
  const andFilters: { [key: string]: [] }[] = [];

  let orFilterIndex = 0;
  for (const query of urlQueries) {
    let queries: { [key: string]: string } = {};
    if (query.startsWith("(") && query.endsWith(")")) {
      const orQueries = query.slice(1, query.length - 1).split("|");
      for (const orQuery of orQueries) {
        const queryParts = orQuery.split("=");
        queries[queryParts[0]] = queryParts[1];
      }
      orFilters[orFilterIndex] = [];
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
        orFilters[orFilterIndex].push(queryInfo.query);
      } else if (Array.isArray(Object.values(queryInfo.query)[0])) {
        andFilters.push(queryInfo.query as { [key: string]: [] });
      } else {
        if (queryInfo.isOption) {
          options = { ...options, ...queryInfo.query };
        } else {
          filter = { ...filter, ...queryInfo.query };
        }
      }
    }
    if (Object.entries(queries).length > 1) orFilterIndex++;
  }

  const combined = [];
  if (orFilters.length > 0) {
    combined.push(...orFilters.map((orFilter) => ({ $or: [...orFilter] })));
  }
  if (andFilters.length > 0) {
    andFilters.forEach((andFilter) =>
      combined.push(...(Object.values(andFilter)[0] as any[]).map((value) => ({ [Object.keys(andFilter)[0]]: value })))
    );
  }
  if (combined.length > 0) filter["$and"] = combined;

  return { filter: filter, options: options };
}

function getIndividualMongoDBQueryFromKeyValue(
  key: string,
  value: string
): { query: { [key: string]: string | {} | [] }; isOption: boolean } {
  const query: { [key: string]: string | {} } = {};
  let isOption = false;
  if (key.startsWith("$")) {
    const optionParams = (value as string).split(":");
    if (optionParams.length === 2) {
      query[key.replace("$", "")] = { [optionParams[0]]: parseInt(optionParams[1]) ?? optionParams[1] };
    } else {
      query[key.replace("$", "")] = parseInt(optionParams[0]);
    }
    isOption = true;
  } else {
    if (value.split(",").length > 1) {
      const values = value.split(",").map((value) => value.toLowerCase());
      query[key] = { $in: values };
    } else if (value.split("-").length === 2) {
      const values = value.split("-");
      query[key] = { $gte: parseInt(values[0]), $lte: parseInt(values[1]) };
    } else if (value.split(":").length === 2) {
      const values = value.split(":");
      const posNegValues = values[1].split("!");
      if (values[0] === "$regex") {
        query[key] = [
          { [values[0]]: posNegValues[0].split("/")[1], $options: posNegValues[0].split("/")[2] },
          posNegValues[1] && { $not: { [values[0]]: posNegValues[1].split("/")[1], $options: posNegValues[1].split("/")[2] } },
        ];
      } else {
        query[key] = [{ [values[0]]: posNegValues[0] }, posNegValues[1] && { $not: { [values[0]]: posNegValues[1] } }];
      }
    } else {
      query[key] = value.toLowerCase();
    }
  }
  return { query: query, isOption: isOption };
}
