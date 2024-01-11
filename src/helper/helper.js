import handlebars from 'handlebars';

handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

export default handlebars;