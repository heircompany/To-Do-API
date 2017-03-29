let env = process.env.NODE_ENV || `development`;

if (env === `development` || env === `test`) {
     let config = require(`./config.json`);
     //access property with variable using bracket notation
     let envConfig = config[env];
     //loop through each configuration and initiate environment
     Object.keys(envConfig).forEach((key) => {
          process.env[key] = envConfig[key];
     });
};
