export interface IFileUpload {
    name: string;
    data: any;
    encoding: string;
    tempFilePath: string;
    truncated: string;
    mimetype: string;
    mv: Function;
}