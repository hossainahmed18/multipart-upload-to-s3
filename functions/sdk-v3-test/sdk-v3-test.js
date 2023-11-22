const { do_something } = require('./other_file');

exports.handler = async (event) => {
   const result = do_something();
   console.log(result);
   return result
};