declare class LogObject {
  /** Application module description */
  public module?: string;

  /** Path to cause of a log record */
  public path?: string;

  /** HTTP method */
  public method?: string;

  /** HTTP response status */
  public status?: string;

  [key: string]: string;
}
