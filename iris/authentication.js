const passport = require('passport');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');
const { Strategy: GitHubStrategy } = require('passport-github2');
const { getUser, createOrFindUser } = require('./models/user');
const { createNewUsersSettings } = require('./models/usersSettings');

const init = () => {
  // Setup use serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    getUser({ id })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });

  // Set up Twitter login
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: 'vxmsICGyIIoT5NEYi1I8baPrf',
        consumerSecret: 'uH7CqsEWPTgMHu7rp8UhiaoS7bzgN53h3od95BEJBFEgUQzMOq',
        callbackURL: `/auth/twitter/callback`,
        includeEmail: true,
      },
      (token, tokenSecret, profile, done) => {
        console.log('profile', profile);
        const user = {
          providerId: profile.id,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: null,
          username: null,
          name: profile.displayName ||
            (profile.name &&
              `${profile.name.givenName} ${profile.name.familyName}`) ||
            null,
          email: (profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value) ||
            null,
          profilePhoto: (profile.photos &&
            profile.photos.length > 0 &&
            profile.photos[0].value) ||
            null,
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'providerId')
          .then(user => Promise.all([user, createNewUsersSettings(user.id)]))
          .then(([user]) => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );

  // Set up Facebook login
  passport.use(
    new FacebookStrategy(
      {
        clientID: '130723117513387',
        clientSecret: 'a153e155c4562f9c04826629f4b8f21c',
        callbackURL: `/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'email', 'photos'],
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: null,
          fbProviderId: profile.id,
          googleProviderId: null,
          githubProviderId: null,
          username: null,
          name: profile.displayName,
          email: profile.emails.length > 0 &&
            profile.emails[0].value !== undefined
            ? profile.emails[0].value
            : null,
          profilePhoto: profile.photos &&
            profile.photos.length > 0 &&
            profile.photos[0].value !== undefined
            ? profile.photos[0].value
            : null,
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'fbProviderId')
          .then(user => Promise.all([user, createNewUsersSettings(user.id)]))
          .then(([user]) => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );

  // Set up Google login
  passport.use(
    new GoogleStrategy(
      {
        clientID: '923611718470-chv7p9ep65m3fqqjr154r1p3a5j6oidc.apps.googleusercontent.com',
        clientSecret: '2nUM1y27p3RosWt-8YqhMJKI',
        callbackURL: `/auth/google/callback`,
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: profile.id,
          githubProviderId: null,
          username: null,
          name: profile.displayName ||
            (profile.name &&
              `${profile.name.givenName} ${profile.name.familyName}`) ||
            null,
          email: (profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value) ||
            null,
          profilePhoto: (profile.photos &&
            profile.photos.length > 0 &&
            profile.photos[0].value) ||
            null,
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'googleProviderId')
          .then(user => Promise.all([user, createNewUsersSettings(user.id)]))
          .then(([user]) => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );

  // Set up GitHub login
  passport.use(
    new GitHubStrategy(
      {
        clientID: '208a2e8684d88883eded',
        clientSecret: '56d46f0fac78e4581a2dfa3e9bda25407eb1363d',
        callbackURL: `/auth/github/callback`,
        scope: ['user'],
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          providerId: null,
          fbProviderId: null,
          googleProviderId: null,
          githubProviderId: profile.id,
          username: null,
          name: profile.displayName || null,
          email: (profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value) ||
            null,
          profilePhoto: (profile._json.avatar_url &&
            profile._json.avatar_url) ||
            null,
          createdAt: new Date(),
          lastSeen: new Date(),
        };

        createOrFindUser(user, 'githubProviderId')
          .then(user => Promise.all([user, createNewUsersSettings(user.id)]))
          .then(([user]) => {
            done(null, user);
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );
};

module.exports = {
  init,
};
