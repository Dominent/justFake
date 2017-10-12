module.exports = (statement, req) => {
    let regex = /{(.*?)}/g;

    let parsed = statement + "";

    let match = regex.exec(statement);
    while (match) {
        let query = req.query[match[1]];
        if (isNaN(query)) {
            query = `'${query}'`;
        }
        parsed = parsed.replace(match[0], query);
        match = regex.exec(statement);
    }

    return parsed;
}
