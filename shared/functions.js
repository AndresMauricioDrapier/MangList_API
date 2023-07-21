const passGenerator = (longitud) => {
    let result = "";
    const abc = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");
    for (let i = 0; i <= longitud; i++) {
        const random = Math.floor(Math.random() * abc.length);
        result += abc[random];
    }
    return result;
};

module.exports = { passGenerator };