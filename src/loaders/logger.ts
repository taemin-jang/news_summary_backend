import winston from "winston";
import { ConsoleTransportInstance } from "winston/lib/winston/transports";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "@config";

// 로그를 저장하는 배열
const transports: Array<ConsoleTransportInstance | DailyRotateFile> = [];

// 로그 파일 저장 경로 -> 루트 경로/logs 폴더
const logDir = `${process.cwd()}/logs`;

// winston 개발 환경 설정
if (process.env.NODE_ENV !== "development") {
  transports.push(
    new DailyRotateFile({
      level: "info", // level 설정
      datePattern: "YYYY-MM-DD", // 파일 날짜 형식
      dirname: logDir,
      filename: `%DATE%.log`,
      zippedArchive: true,
      handleExceptions: true,
      maxFiles: 30,
    }),
    new DailyRotateFile({
      level: "error", // level 설정
      datePattern: "YYYY-MM-DD", // 파일 날짜 형식
      dirname: logDir + "/error",
      filename: `%DATE%.log`,
      zippedArchive: true,
      handleExceptions: true,
      maxFiles: 30,
    })
  );
} else {
  // development 환경인 경우 화면에 로그가 바로 찍힘
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

const LoggerInstance = winston.createLogger({
  /** 해당 level 이상의 우선순위를 갖는 log만 출력
   * 숫자가 낮을 수록 우선순위가 높다. (error가 가장 위험하기 때문에 우선순위가 제일 높음)
   * error : 0
   * warn : 1
   * info : 2
   * http : 3
   * verbose : 4
   * debug : 5
   * silly : 6
   * 현재 개발 환경이 development이면 error ~ debug까지 출력, 개발 환경이 아니면 error ~ warn까지만 출력
   */
  level: config.logs.level,
  // level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});
export default LoggerInstance;
