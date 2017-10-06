const mongoose = require('mongoose');
const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url'); 

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Mailer = require('../services/mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/:surveyId/:choice', (req ,res) => {
    res.send('Thans for voting');
  });

  app.get('/api/surveys', requireLogin, async (req ,res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      // do not include recipients list in response from database
      .select({ recipients: false });
    res.send(surveys);
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const path = new Path('/api/surveys/:surveyId/:choice');
    
    _.chain(req.body)
      .map(event => {
        // extract pathname from event url string
        const pathname = new URL(event.url).pathname;
        // parse pathname and extract surveyId and choice parameters from it
        const extractedParams = path.test(pathname);
        if (extractedParams) {
          return {
            email: event.email,
            surveyId: extractedParams.surveyId,
            choice: extractedParams.choice
          };
        }
      })
      // filter out udefined elements from events array
      .compact()
      // remove duplicates from filteredEvents
      .uniqBy('email', 'surveyId')
      .each(event => {
        // find survey document in Survey collection with specified Id and recipient item with provided email and currently not responded
        Survey.updateOne(
        {
          _id: event.surveyId,
          recipients: {
            $elemMatch: { email: event.email, responded: false }
          }
        }, {
          // update finded recipient document
          $inc: { [event.choice]: 1 }, // increment 'yes' or 'no' prop (choice from the event) value by 1
          $set: { 'recipients.$.responded': true }, // update responded property of finded recipient sub document ($) to 'true'
          lastResponded: new Date() // update lastResponded prop with new date
        }).exec(); // execute query
      })
      // return transformed array
      .value();
    
    console.log('Events received by webhook');
    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
      const survey = new Survey({
        title,
        subject,
        body,
        recipients: recipients.split(',').map(email => ({ email: email.trim() })),
        _user: req.user.id,
        dateSent: Date.now()
      });

      const mailer = new Mailer(survey, surveyTemplate(survey));

      try {
        await mailer.send();
        await survey.save();
        
        req.user.credits -= 1;

        const user = await req.user.save();
        res.send(user);
      } catch (err) {
        res.status(422).send(err);
      }
  });
};