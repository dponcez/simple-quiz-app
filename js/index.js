const initApp = () => {
  // testing
  const log = (value) => console.log(value);

  // element selector
  const querySelector = (element) => document.querySelector(element);
  const querySelectorAll = (element) => document.querySelectorAll(element);

  // create element
  const createElement = (element) => document.createElement(element);

  // events
  const eventHandler = ($, event, callback) => $.addEventListener(event, callback);

  let data;
  let score = 0;
  let currentData = 0;
  let currentIndex = 0;

  const htmlReference = {
    inputs: querySelectorAll('[data-input]'),
    options: querySelectorAll('[data-option]'),
    nextBtn: querySelector('[data-state]'),
    heading: querySelector('[data-heading]'),
    container: querySelector('.group'),
    form: querySelector('form'),
    currentScore: querySelector('[data-score'),
    total: querySelector('[data-total')
  }

  const {
    inputs,
    options,
    nextBtn,
    heading,
    container,
    form,
    currentScore,
    total
  } = htmlReference

  const fetchQuestions = async () => {
    
    try {
      const requestURL = '/json/index.json';
      const request = await fetch(requestURL);
      
      if(!request.ok){
        throw new Error('Failed to fetch data from index.json')
      }

      const response = await request.json();
      data = response;
      loadQuiz(data[currentIndex]);
    } catch (error) {

      if(error instanceof TypeError){
        let errorMsg = 'System error occurred. Please check logs for more details';
        return errorMsg
      }
      
    }
  }

  fetchQuestions();

  const loadQuiz = (source) => {
    disabledAnswer();

    const {
      question,
      optionA,
      optionB,
      optionC,
      optionD
    } = source;

    heading.innerHTML = `${question}`;
    currentScore.textContent = currentIndex + 1;
    total.textContent = data.length;

    options.forEach($ => {
      const {option} = $.dataset;

      if(option === 'optionA') $.innerHTML = `${optionA}`;
      if(option === 'optionB') $.innerHTML = `${optionB}`;
      if(option === 'optionC') $.innerHTML = `${optionC}`;
      if(option === 'optionD') $.innerHTML = `${optionD}`
    })
  }

  const para = createElement('p');
  para.className = 'description';

  const disabledAnswer = () => {
    inputs.forEach(input => {
      input.checked = false;

      eventHandler(input, 'input', () => {
        const checked = input.checked;

        if(checked === true){
          para.style.display = 'none';
          para.textContent = '';
          form.appendChild(para);
          nextBtn.style.cursor = 'pointer';
          nextBtn.disabled = false;
        }
      })
    })
  }

  const getAnswerSelected = () => {
    let getAnswer;

    inputs.forEach(input => {
      if(input.checked){
        getAnswer = input.id;
      }
    });

    return getAnswer
  }

  const handleClick = (e) => {
    e.preventDefault();
    currentIndex++;
    const answer = getAnswerSelected();

    if(answer === data[currentData].correct){
      score++;
    }
    
    if(!answer){
      currentIndex = 0;
      currentData = 0;

      para.textContent = 'Please select an option to continue';
      para.style.color = 'hsl(358, 100%, 62%)';
      form.appendChild(para);

      nextBtn.disabled = true;
      nextBtn.style.cursor = 'not-allowed';
    }else{
      currentData++;

      if(currentData < data.length){
        loadQuiz(data[currentIndex]);
      }else{
        container.innerHTML = `
          <p class='info'>Total questions: 
            <span>${data.length}</span>
          </p>
          <p class='info'>Correct answers: 
            <span>${score}</span>
          </p>
          <button class='btn' onclick='location.reload()'>reload</button>
        `
      }
    }
  }

  eventHandler(nextBtn, 'click', handleClick);

}

document.addEventListener('DOMContentLoaded', initApp)