import fs from "fs"
import path from "path"

export const logError = (data, isConnect=false) => {
    try{
        const logFilePath = path.join("./logs/", `${isConnect ? "connect-error-log.json" : "http-error-log.json"}`);
        const currentLog = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath, 'utf8')) : [];
        currentLog.push({ timestamp: new Date(), ...data });
        fs.writeFileSync(logFilePath, JSON.stringify(currentLog, null, 2), 'utf8');        
    }catch (err){
        console.error(err)
    }
}
