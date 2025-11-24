$(function(){
  const words = [
    {eng: "always", ua: "завжди"},
    {eng: "hello", ua: "привіт"},
    {eng: "cat", ua: "кіт"},
    {eng: "dog", ua: "собака"},
    {eng: "book", ua: "книга"},
    {eng: "water", ua: "вода"},
    {eng: "sun", ua: "сонце"},
    {eng: "moon", ua: "місяць"},
    {eng: "apple", ua: "яблуко"},
    {eng: "school", ua: "школа"},
    {eng: "friend", ua: "друг"},
    {eng: "family", ua: "сім'я"}
  ];

  const MIN_WORDS = 10;
  let pool = words.slice(0); 
  if(pool.length < MIN_WORDS){
    console.warn("Надано менше слів, ніж потрібно. Додайте ще слова.");
  }

  function shuffle(arr){
    for(let i = arr.length -1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  pool = shuffle(pool).slice(0, Math.max(MIN_WORDS, Math.min(pool.length, pool.length)));
  const total = pool.length;

  let currentIndex = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let answered = new Array(total).fill(false);

  const $wordText = $("#wordText");
  const $currentStep = $("#currentStep");
  const $totalSteps = $("#totalSteps");
  const $translationInput = $("#translationInput");
  const $checkBtn = $("#checkBtn");
  const $card = $("#wordCard");
  const $prevBtn = $("#prevBtn");
  const $nextBtn = $("#nextBtn");
  const $correctCount = $("#correctCount");
  const $incorrectCount = $("#incorrectCount");
  const $resultModal = $("#resultModal");
  const $modalText = $("#modalText");
  const $showStatsBtn = $("#showStatsBtn");
  const $restartBtn = $("#restartBtn");
  const $closeModalBtn = $("#closeModalBtn");

  $totalSteps.text(total);
  updateUI();

  function updateUI(){
    const obj = pool[currentIndex];
    $wordText.text(obj.eng);
    $currentStep.text(currentIndex + 1);
    $correctCount.text(correctCount);
    $incorrectCount.text(incorrectCount);
    $translationInput.val("");
    $prevBtn.prop("disabled", currentIndex === 0);
    $nextBtn.prop("disabled", currentIndex === total - 1);
  }

  function checkAnswer(){
    const user = $translationInput.val().trim().toLowerCase();
    if(user === ""){
      $translationInput.addClass("invalid");
      $translationInput[0].focus();
      flashCard("Будь ласка, введіть переклад");
      setTimeout(()=> $translationInput.removeClass("invalid"), 900);
      return;
    }
    const correct = pool[currentIndex].ua.toLowerCase();
    if(user === correct){
      markCorrect(currentIndex);
      flashCard("Правильно!", true);
    } else {
      markIncorrect(currentIndex);
      flashCard(`Невірно — правильний: ${pool[currentIndex].ua}`, false);
    }

    if(correctCount + incorrectCount >= total){
      showResultModal();
    } else {
      setTimeout(() => {
        if(currentIndex < total - 1) currentIndex++;
        updateUI();
        $translationInput.focus();
      }, 700);
    }
  }

  function markCorrect(i){
    if(!answered[i]){
      correctCount++;
      answered[i] = true;
    }
    $correctCount.text(correctCount);
  }
  function markIncorrect(i){
    if(!answered[i]){
      incorrectCount++;
      answered[i] = true;
    }
    $incorrectCount.text(incorrectCount);
  }

  function flashCard(text, ok){
    const prevText = $wordText.text();
    $wordText.text(text);
    $card.css("transform","translateY(-4px)");
    if(ok){
      $card.css("box-shadow", "0 12px 30px rgba(16,185,129,0.12)");
    } else {
      $card.css("box-shadow", "0 12px 30px rgba(239,68,68,0.12)");
    }
    setTimeout(()=>{
      $wordText.text(prevText);
      $card.css("transform","");
      $card.css("box-shadow","");
    },650);
  }

  function showResultModal(){
    const percent = Math.round((correctCount/total)*100);
    let level = "";
    if(percent >= 90) level = "Відмінно";
    else if(percent >= 70) level = "Добре";
    else if(percent >= 50) level = "Задовільно";
    else level = "Потрібно покращити";

    $modalText.html(`
      Ви відповіли на <strong>${total}</strong> слів.<br/>
      Вірних: <strong>${correctCount}</strong><br/>
      Невірних: <strong>${incorrectCount}</strong><br/>
      Ваш результат: <strong>${percent}%</strong> — <strong>${level}</strong>.
    `);
    $resultModal.attr("aria-hidden","false");
  }

  function closeResultModal(){
    $resultModal.attr("aria-hidden","true");
  }

  $card.on("click", function(){
    checkAnswer();
  });
  $translationInput.on("keydown", function(e){
    if(e.key === "Enter"){
      e.preventDefault();
      checkAnswer();
    }
  });
  $card.on("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      checkAnswer();
    }
  });

  $checkBtn.on("click", function(){ checkAnswer(); });
  $prevBtn.on("click", function(){
    if(currentIndex > 0) currentIndex--;
    updateUI();
  });
  $nextBtn.on("click", function(){
    if(currentIndex < total - 1) currentIndex++;
    updateUI();
  });

  $showStatsBtn.on("click", showResultModal);
  $closeModalBtn.on("click", closeResultModal);
  $restartBtn.on("click", function(){
    pool = shuffle(pool);
    currentIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    answered = new Array(total).fill(false);
    updateUI();
    closeResultModal();
  });

  function quickTip(msg){
    console.info(msg);
  }

  $translationInput.focus();
});
