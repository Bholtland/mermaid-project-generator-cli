import { MermaidParserObject } from "../nest-object.schema";

export const RelationType = [
    "inheritance",
    "composition",
    "aggregation",
    "association",
    "link",
    "dependency",
    "realization",
] as const;
export type RelationType = typeof RelationType[number];

export interface Relation {
    primarySideName: string;
    foreignSideName: string;
    foreignSide?: MermaidParserObject;
    type: RelationType;
}

export default function (regexResult: string[]): Relation {
    let type: RelationType;
    let primarySideName: string;
    let foreignSideName: string;

    const valueIndex: number = regexResult
        .slice(3, 16)
        .reduce((acc, val, index) => {
            if (val) {
                acc = index;
            }
            return acc;
        }, -1);

    switch (valueIndex) {
        case 0:
            type = "inheritance";
            primarySideName = regexResult[17];
            foreignSideName = regexResult[1];
            break;
        case 1:
            type = "inheritance";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 2:
            type = "association";
            primarySideName = regexResult[17];
            foreignSideName = regexResult[1];
            break;
        case 3:
            type = "association";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 4:
            type = "composition";
            primarySideName = regexResult[17];
            foreignSideName = regexResult[1];
            break;
        case 5:
            type = "composition";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 6:
            type = "aggregation";
            primarySideName = regexResult[17];
            foreignSideName = regexResult[1];
        case 7:
            type = "aggregation";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 8:
            type = "link";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 13:
            type = "link";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 9:
            type = "dependency";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        case 10:
            type = "dependency";
            primarySideName = regexResult[17];
            foreignSideName = regexResult[1];
            break;
        case 11:
            type = "realization";
            primarySideName = regexResult[17];
            foreignSideName = regexResult[1];
            break;
        case 12:
            type = "realization";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
            break;
        default:
            type = "dependency";
            primarySideName = regexResult[1];
            foreignSideName = regexResult[17];
    }

    return {
        type,
        primarySideName,
        foreignSideName,
    };
}
