module.exports = {
    isObject: (obj) => {
        return obj === Object(obj);
    },
    isHtml: (text) => {
        return Boolean(text.match(/<.*>/g));
    },
    getRandomArbitrary: (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
