interface BuildWhereOptions<TFilters extends object> {
  textFields: (keyof TFilters)[];
  exactFields: (keyof TFilters)[];
}

export function createWhereBuilder<
  TFilters extends object,
  TWhere extends object,
>(options: BuildWhereOptions<TFilters>) {
  return function buildWhere(search?: string, filters?: TFilters): TWhere {
    const conditions: object[] = [];

    if (search) {
      conditions.push({
        OR: options.textFields.map((field) => ({
          [field]: { contains: search },
        })),
      });
    } else {
      // nada
    }

    if (filters) {
      for (const field of options.textFields) {
        if (filters[field]) {
          conditions.push({
            [field]: {
              contains: filters[field] as string,
            },
          });
        }
      }

      for (const field of options.exactFields) {
        if (filters[field]) {
          conditions.push({ [field]: filters[field] });
        }
      }
    } else {
      // nada
    }

    return (conditions.length > 0 ? { AND: conditions } : {}) as TWhere;
  };
}
