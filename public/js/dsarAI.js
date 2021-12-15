Survey
    .StylesManager
    .applyTheme("modern");

var json = {
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "expression",
     "name": "question1",
     "title": "Click 'Next' to start recording a newly received Data Access Request in log book"
    }
   ],
   "title": "Store AI",
   "description": "Data Access Request Intake Automation"
  },
  {
   "name": "page2",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question2",
     "title": "Is the request made in one of the following languages?",
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": "English"
      },
      {
       "value": "item2",
       "text": "繁體中文"
      }
     ],
     "hasOther": true
    },
    {
     "type": "radiogroup",
     "name": "question9",
     "title": "Does the request specify a language of choice?",
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": "English"
      },
      {
       "value": "item2",
       "text": "繁體中文"
      }
     ],
     "hasOther": true
    },
    {
     "type": "boolean",
     "name": "question3",
     "title": "Is the request made in a prescribed form?"
    },
    {
     "type": "radiogroup",
     "name": "question4",
     "title": "Does the request specify any set of data requested?",
     "choices": [
      {
       "value": "item1",
       "text": "No"
      }
     ],
     "hasOther": true,
     "otherText": "Yes (describe)"
    },
    {
     "type": "radiogroup",
     "name": "question5",
     "title": "Does the request specify any form, such as computer disk, microfilm?",
     "choices": [
      {
       "value": "item1",
       "text": "No"
      }
     ],
     "hasOther": true,
     "otherText": "Yes (describe)"
    }
   ]
  },
  {
   "name": "page3",
   "elements": [
    {
     "type": "radiogroup",
     "name": "question6",
     "title": "Does the request specify any date of data collection?",
     "choices": [
      {
       "value": "item3",
       "text": "No"
      }
     ],
     "hasOther": true,
     "otherText": "Yes (describe)"
    },
    {
     "type": "radiogroup",
     "name": "question7",
     "title": "Does the request include any relevant information about the particular incident or transaction associated with the data requested and the circumstances under which the data requested was collected?",
     "choices": [
      {
       "value": "item3",
       "text": "No"
      }
     ],
     "hasOther": true,
     "otherText": "Yes (describe)"
    },
    {
     "type": "boolean",
     "name": "OnBehalfOf",
     "title": "Is the requestor making a data access request on behalf of another individual",
     "isRequired": true
    },
    {
     "type": "boolean",
     "name": "question10",
     "visibleIf": "{OnBehalfOf} = true",
     "title": "If it is a request made on behalf of another individual, is the requestor able to provide identity proof of the requestor?",
     "requiredIf": "{OnBehalfOf} = true"
    },
    {
     "type": "boolean",
     "name": "question11",
     "visibleIf": "{OnBehalfOf} = true",
     "title": "If it is a request made on behalf of another individual, is the requestor able to provide authorization and/or proof of the requestor’s relationship with the individual?",
     "requiredIf": "{OnBehalfOf} = true"
    },
    {
     "type": "boolean",
     "name": "question12",
     "visibleIf": "{OnBehalfOf} = true",
     "title": "If it is a request made on behalf of another individual, is the requestor able to provide identity proof of the individual whose personal data is sought?",
     "requiredIf": "{OnBehalfOf} = true"
    }
   ]
  },
  {
   "name": "page4",
   "elements": [
    {
     "type": "expression",
     "name": "question8",
     "title": "This completes the intake. The AI will now enter the request into your log book."
    }
   ]
  },
  {
   "name": "page5",
   "elements": [
    {
     "type": "expression",
     "name": "question13",
     "title": "The AI can find 1 data set in your possession matching the supplied Data Access Request data."
    }
   ]
  },
  {
   "name": "page6",
   "elements": [
    {
     "type": "expression",
     "name": "question14",
     "title": "The AI discovers 1 potential issue. The AI also finds 3 similar requests in your log book."
    }
   ]
  },
  {
   "name": "page7",
   "elements": [
    {
     "type": "expression",
     "name": "question15",
     "title": "The AI suggests making a response within 40 days as follows:",
     "description": "The present Data Access Request was made following two or more similar requests. It is unreasonable for our company to comply with the present Data Access Request in the circumstances.",
     "descriptionLocation": "underInput"
    }
   ]
  }
 ]
};

window.survey = new Survey.Model(json);

survey
.onComplete
.add(function (sender) {
  //$.post(`/survey/suppliers`, {results: JSON.stringify(sender.data, null, 3)}, function(data, status) {
    document
    .querySelector('#surveyResult')
    .textContent = "Successfully completed survey";
  //})
});

survey.render("surveyElement");
