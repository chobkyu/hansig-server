import express, {Request,Response} from "express"
import morgan from "morgan"


require("dotenv").config();
const logger = require('./src/util/winston');
const app = express();
const cors = require('cors')

const hansic = require('./src/router/hansic');
const user = require('./src/router/users');
const owner = require('./src/router/owner');
const review=require('./src/router/review');
const admin = require('./src/router/admin');
const point = require('./src/router/point');
const combined = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' 
// 기존 combined 포멧에서 timestamp만 제거
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined; // 
const redisClient=require('./src/util/redis');
redisClient.connect();
if(process.env.NODE_ENV!=='test'){
    app.use(morgan(morganFormat,{stream:logger.stream}))
}
// app.get("/",(req:Request,res:Response) => {
//     res.send("hello world");
// });

app.use(express.static(__dirname+'/src/public'));
app.use(express.json());
//url을 통해 전달되는 테이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use('/hansic',hansic);
app.use('/users',user);
app.use('/owner',owner);
app.use('/review',review);
app.use('/admin',admin);
app.use('/point',point);

module.exports = app;
