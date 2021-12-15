Survey
    .StylesManager
    .applyTheme("modern");

var json = {
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "checkbox",
     "name": "question2",
     "title": {
      "default": "Notify me when the following arrives",
      "zh-tw": "請給我這類型的純素廣告"
     },
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": {
        "default": "Restaurant Vegan Dish",
        "zh-tw": "餐廳 - 純素餐"
       }
      },
      {
       "value": "item2",
       "text": {
        "default": "Groceries Vegan Product",
        "zh-tw": "超市 - 純素產品"
       }
      },
      {
       "value": "item3",
       "text": {
        "default": "Fashion & Lifestyle Vegan Product",
        "zh-tw": "純素時裝及生活產品"
       }
      }
     ],
     "hasNone": true,
     "noneText": {
      "default": "Do not send me anything",
      "zh-tw": "不要任何廣告"
     }
    },
    {
     "type": "checkbox",
     "name": "question3",
     "visible": false,
     "visibleIf": "{question2} contains 'item1'",
     "title": {
      "default": "Vegan Dishes",
      "zh-tw": "純素餐"
     },
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": {
        "default": "Salad",
        "zh-tw": "沙律"
       }
      },
      {
       "value": "item2",
       "text": {
        "default": "Burger",
        "zh-tw": "漢堡包"
       }
      },
      {
       "value": "item3",
       "text": {
        "default": "Plant-Based Meat - beef/pork/chicken/seafood",
        "zh-tw": "植物性肉類 - 牛/豬/雞/海鮮"
       }
      },
      {
       "value": "item4",
       "text": {
        "default": "Dim Sum",
        "zh-tw": "點心"
       }
      },
      {
       "value": "item5",
       "text": {
        "default": "Noodles",
        "zh-tw": "麵類"
       }
      },
      {
       "value": "item6",
       "text": {
        "default": "Snack",
        "zh-tw": "零食"
       }
      },
      {
       "value": "item7",
       "text": {
        "default": "Dessert",
        "zh-tw": "甜品"
       }
      },
      {
       "value": "item8",
       "text": {
        "default": "Coffee & Drinks",
        "zh-tw": "咖啡及飲料"
       }
      }
     ]
    },
    {
     "type": "checkbox",
     "name": "question4",
     "visible": false,
     "visibleIf": "{question2} contains 'item2'",
     "title": {
      "default": "Vegan Product",
      "zh-tw": "純素產品"
     },
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": {
        "default": "Plant-Based Meat - beef/pork/chicken/seafood",
        "zh-tw": "植物性肉類 - 牛/豬/雞/海鮮"
       }
      },
      {
       "value": "item2",
       "text": {
        "default": "Plant-Based Egg",
        "zh-tw": "植物性蛋"
       }
      },
      {
       "value": "item3",
       "text": {
        "default": "Plant-Based Dairy",
        "zh-tw": "植物性奶"
       }
      },
      {
       "value": "item4",
       "text": {
        "default": "Seasonings",
        "zh-tw": "調味料"
       }
      },
      {
       "value": "item5",
       "text": {
        "default": "Sauce",
        "zh-tw": "醬料"
       }
      },
      {
       "value": "item6",
       "text": {
        "default": "Snack",
        "zh-tw": "零食"
       }
      },
      {
       "value": "item7",
       "text": {
        "default": "Dessert",
        "zh-tw": "甜品"
       }
      },
      {
       "value": "item8",
       "text": {
        "default": "Drinks",
        "zh-tw": "飲品"
       }
      },
      {
       "value": "item9",
       "text": "item9"
      },
      {
       "value": "item10",
       "text": "item10"
      }
     ]
    },
    {
     "type": "checkbox",
     "name": "question5",
     "visible": false,
     "visibleIf": "{question2} contains 'item3'",
     "title": {
      "default": "Fashion & Lifestyle Vegan Product",
      "zh-tw": "純素時裝及生活產品"
     },
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": {
        "default": "Clothes",
        "zh-tw": "衣服類"
       }
      },
      {
       "value": "item2",
       "text": {
        "default": "Bag",
        "zh-tw": "袋"
       }
      },
      {
       "value": "item3",
       "text": {
        "default": "Shoes",
        "zh-tw": "鞋"
       }
      },
      {
       "value": "item4",
       "text": {
        "default": "Body Care & Cosmetics",
        "zh-tw": "護膚及化妝"
       }
      },
      {
       "value": "item5",
       "text": {
        "default": "Hand-Made Jewelries",
        "zh-tw": "手工飾物"
       }
      },
      {
       "value": "item6",
       "text": {
        "default": "Zero-Waste Products",
        "zh-tw": "零廢概念產品"
       }
      },
      {
       "value": "item7",
       "text": {
        "default": "Recycled & Upcycled Products",
        "zh-tw": "環保概念產品"
       }
      },
      {
       "value": "item8",
       "text": {
        "default": "Recycled & Upcycled Services",
        "zh-tw": "環保概念服務"
       }
      },
      {
       "value": "item9",
       "text": "item9"
      }
     ]
    }
   ],
   "title": "Pay-A-Vegan",
   "description": {
    "default": "You are in control of your AD",
    "zh-tw": "選擇你要看的純素廣告"
   }
  },
  {
   "name": "page2",
   "elements": [
    {
     "type": "checkbox",
     "name": "question6",
     "title": {
      "default": "Seller Location - select more than 1",
      "zh-tw": "商店位置 - 可選多項"
     },
     "isRequired": true,
     "choices": [
      {
       "value": "item1",
       "text": {
        "default": "HK Island",
        "zh-tw": "香港島"
       }
      },
      {
       "value": "item2",
       "text": {
        "default": "Kowloon",
        "zh-tw": "九龍"
       }
      },
      {
       "value": "item3",
       "text": {
        "default": "New Territories",
        "zh-tw": "新界"
       }
      },
      {
       "value": "item4",
       "text": {
        "default": "Islands",
        "zh-tw": "離島"
       }
      },
      {
       "value": "item5",
       "text": {
        "default": "Online",
        "zh-tw": "網上商店"
       }
      }
     ]
    },
    {
     "type": "matrixdropdown",
     "name": "question8",
     "title": {
      "default": "Notify me during - select more than 1",
      "zh-tw": "只在下列時間通知我 - 可選多項"
     },
     "isRequired": true,
     "columns": [
      {
       "name": "Morning",
       "title": "Morning"
      },
      {
       "name": "Afternoon",
       "title": "Afternoon"
      },
      {
       "name": "Evening",
       "title": "Evening"
      }
     ],
     "choices": [
      {
       "value": "Yes",
       "text": "Yes"
      }
     ],
     "cellType": "checkbox",
     "rows": [
      {
       "value": "Mon-Fri only",
       "text": "Mon-Fri only"
      },
      {
       "value": "Sat-Sun only",
       "text": "Sat-Sun only"
      }
     ]
    }
   ]
  }
 ]
};

window.survey = new Survey.Model(json);

survey
.onComplete
.add(function (sender) {
  //$.post(`/survey/consumers`, {results: JSON.stringify(sender.data, null, 3)}, function(data, status) {
    document
    .querySelector('#surveyResult')
    .textContent = "Successfully completed survey";
  //})
});

survey.render("surveyElement");

$(document).ready(function(){
  $(".localeButton").on("change", function() {
    switch($(this).val()) {
      case 'en' :
        survey.locale = "en";
        break;
      case 'zh-tw' :
        survey.locale = "zh-tw";
        break;
    }
  });
});
