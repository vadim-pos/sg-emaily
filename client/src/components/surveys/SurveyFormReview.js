import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import formFields from './formFields';
import * as actions from '../../actions';

const SurveyReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const formFieldsElements = formFields.map(({ name, label }) => (
    <div key={name}>
      <label>{label}</label>
      <div>
        {formValues[name]}
      </div>
    </div>
  ));

  return(
    <div>
      <h5>Please confirm your entries</h5>
      {formFieldsElements}
      <button className="yellow darken-3 white-text btn-flat"
              onClick={onCancel}>
              Cancel
      </button>
      <button className="green right white-text btn-flat"
              onClick={() => submitSurvey(formValues, history)}>
              Send Survey
              <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

// Retrieve values from redux form
const mapStateToProps = state => ({ formValues: state.form.surveyForm.values });

export default connect(mapStateToProps, actions)(withRouter(SurveyReview));