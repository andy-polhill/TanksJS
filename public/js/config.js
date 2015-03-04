define(['underscore', 'config/all', 'config/' + process.env.NODE_ENV],
  function( _, all, env ) {

    console.log('all:' + JSON.stringify(all));

    var config = _.extend(all, env || {});

    console.log(JSON.stringify(config));

    return config;
  }
);
