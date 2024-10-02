declare class Logger {
    name: any;
    constructor(service: string);
    log(message: string, opts?: object): void;
    error(message: string, opts?: object): void;
}
export default Logger;
