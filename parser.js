const FAKE_DATA_PROVIDER = 'faker';

const faker = require(FAKE_DATA_PROVIDER);

module.exports.parse = (statement, providers, req) => {
    if (statement.toLowerCase().match('jf')) {
        return eval(statement.replace('jf', FAKE_DATA_PROVIDER));
    }

    for (let provider of providers) {
        statement = provider(statement, req);
    }

    return eval(statement);
}
