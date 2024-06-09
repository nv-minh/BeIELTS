import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";

export function getOffset(paginationOptions: IPaginationOptions) {
    let offset = 0;
    if (paginationOptions.page && paginationOptions.limit) {
        if (Number(paginationOptions.page) > 0) {
            offset = (Number(paginationOptions.page) - 1) * Number(paginationOptions.limit)
        }
    }
    return offset
}

export function getArrayPaginationBuildTotal<T>(
    totalItems: any[],
    totalData: any[],
    options: any
): Pagination<T> {
    const { limit, page } = options;

    const selectedItems = totalItems;
    let totalRecord = 0
    if (totalData.length > 0) {
        totalRecord = totalData[0].Total;
    }
    const pagination = {
        totalItems: Number(totalRecord),
        itemCount: Number(totalRecord),
        itemsPerPage: Number(limit),
        totalPages: Math.ceil(Number(totalRecord) / limit),
        currentPage: Number(page),
    };

    return new Pagination(selectedItems, pagination, null);
}

export function calculateBandScores(numberOfCorrectAnswers) {
    if (numberOfCorrectAnswers >= 0 && numberOfCorrectAnswers <= 1) {
        return 0
    } else if (numberOfCorrectAnswers >= 2 && numberOfCorrectAnswers <= 4) {
        return 1
    }
    else if (numberOfCorrectAnswers >= 5 && numberOfCorrectAnswers <= 7) {
        return 2
    }
    else if (numberOfCorrectAnswers >= 7 && numberOfCorrectAnswers <= 9) {
        return 3
    }
    else if (numberOfCorrectAnswers >= 10 && numberOfCorrectAnswers <= 12) {
        return 4
    }
    else if (numberOfCorrectAnswers >= 13 && numberOfCorrectAnswers <= 15) {
        return 4.5
    }
    else if (numberOfCorrectAnswers >= 16 && numberOfCorrectAnswers <= 17) {
        return 5
    }
    else if (numberOfCorrectAnswers >= 18 && numberOfCorrectAnswers <= 22) {
        return 5.5
    }
    else if (numberOfCorrectAnswers >= 23 && numberOfCorrectAnswers <= 25) {
        return 6
    }
    else if (numberOfCorrectAnswers >= 26 && numberOfCorrectAnswers <= 29) {
        return 6.5
    }
    else if (numberOfCorrectAnswers >= 30 && numberOfCorrectAnswers <= 31) {
        return 7
    }
    else if (numberOfCorrectAnswers >= 32 && numberOfCorrectAnswers <= 34) {
        return 7.5
    }
    else if (numberOfCorrectAnswers >= 35 && numberOfCorrectAnswers <= 36) {
        return 8
    }
    else if (numberOfCorrectAnswers >= 37 && numberOfCorrectAnswers <= 38) {
        return 8.5
    }
    else if (numberOfCorrectAnswers >= 39 && numberOfCorrectAnswers <= 40) {
        return 9
    } else return 9
}

export function roundToHalf(number) {
    // Làm tròn số đến 1 chữ số thập phân
    var roundedNumber = Math.round(number * 10) / 10;
    
    // Lấy phần thập phân
    var decimal = roundedNumber % 1;
  
    // Làm tròn đến 0.5
    if (decimal < 0.25) {
      return Math.floor(roundedNumber);
    } else if (decimal < 0.75) {
      return Math.floor(roundedNumber) + 0.5;
    } else {
      return Math.ceil(roundedNumber);
    }
  }