export const randomPoint = () => {
    const randNum = Math.floor(Math.random()*1001);

    if(randNum>=995){
        return 1000;
    }else if(randNum<995 && randNum>900){
        return 5;
    }else{
        return 1;
    }
}

module.exports = { randomPoint }