//lövhələr
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];
// dəyişənləri yarat
  var timer;
  var timeRemaining;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;
  window.onload = function() {
      //düymə basıldıqda startGame funksiyasını başlat
        id("start-btn").addEventListener("click", startGame);
      // number containerdə olan hər bir rəqəmə event listener əlavə etmək
      for (let i = 0; i < id("number-container").children.length; i++) {
          id("number-container").children[i].addEventListener("click", function(){
              // disableSelect false olub olmaması
              if (!disableSelect) {
                  //əgər rəqəm seçilidirsə
                  if(this.classList.contains("selected")) {
                      // seçimi ləğv elə                             
                      this.classList.remove("selected");
                      selectedNum = null;
                  } else {
                      //digər seçili rəqəmləri seçimdən qaldırmaq
                      for (let i = 0; i < id("number-container").children.length; i++) {
                          id("number-container").children[i].classList.remove("selected");
                      }
                      // seç və selectedNum dəyişənini güncəllə
                      this.classList.add("selected");
                      selectedNum = this;
                      updateMove();
                  }
              }
          });
      }
  }
  function startGame() {
      // Çətinlik səviyyəsi seçimi
      let board;
      if (id("diff-1").checked) board = easy[0];
      else if (id("diff-2").checked) board = medium[0];
      else board = hard[0];
      //can və seçim etməyi aktivləşdirmə
      lives = 3;
      disableSelect = false;
      id("lives").textContent = "Lives: 3";
      //Lövhələri çətinliyə görə yaratmaq
      generateBoard(board);
      //zamanlayıcını başladır
      startTimer();
      // number container'i görünür hala salmaq
      id("number-container").classList.remove("hidden");
  }
  function startTimer() {
      // nə qədər vaxt qaldığını göstərmək
      if (id("time-1").checked) timeRemaining = 180;
      else if (id("time-2").checked) timeRemaining = 300;
      else timeRemaining = 600;
      // ilk saniyə üçün taymer təyin edir
      id("timer").textContent = timeConversion(timeRemaining);
      // taymerin hər saniyə güncəlləməsi
      timer = setInterval(function(){
          timeRemaining--;
          // vaxt qalmayıbsa oyunu bitir
          if (timeRemaining === 0) endGame();
          id("timer").textContent = timeConversion(timeRemaining);
      }, 1000)
  }
  // saniyəni dəqiqə və saniyə formatına çevirir
  function timeConversion(time){
     let minutes = Math.floor(time/60);
     if (minutes < 10) minutes = "0" + minutes;
     let seconds = time % 60;
     if (seconds < 10) seconds = "0" + seconds;
     return minutes + ":" + seconds;
  }
  function generateBoard(board) {
      //əvvəlki lövhəni silmək
      clearPrevious();
      //artım idsi
      let idCount = 0;
      // 81 plitə yaratmaq
      for (let i = 0; i < 81; i++) {
          // yeni paragraf elementi yaratmaq
          let tile = document.createElement("p");
          // əgər plitə boş olmamalıdırsa
          if (board.charAt(i) != "-") {
              // plitəyə düzgün rəqəmi qoymaq
              tile.textContent = board.charAt(i);
          } else {
              // plitəyə click event listener əlavə etmək
              tile.addEventListener("click", function() {
                  if (!disableSelect) {
                      // plitə artıq seçilidirsə 
                      if (tile.classList.contains("selected")){
                          // onda seçimi ləğv et
                          tile.classList.remove("selected");
                          selectedTile = null;
                      } else {
                          // digər plitələri seçimini ləğv edəciyik
                          for (let i = 0; i < 81; i++){
                              qsa(".tile")[i].classList.remove("selected");
                          }
                          // seçimimizi əlavə etmək və dəyişəni güncəlləmək
                          tile.classList.add("selected");
                          selectedTile = tile;
                          updateMove();
                      }
                  }
              });
          }
          // plitə idsi təyin etmək
          tile.id = idCount;
          // digər plitə üçün id artırmaq
          idCount ++;
          // bütün plitələrə plitə classı əlavə etmək
          tile.classList.add("tile");
          if ((tile.id > 17 &&  tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
              tile.classList.add("bottomBorder");
          }   
          if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
              tile.classList.add("rightBorder");
          }
          //plitələri lövhəyə əlavə etmək
          id("board").appendChild(tile);
      } 
  }

  function updateMove() {
      // əgər bir plitə və rəqəm seçilidirsə
      if(selectedTile && selectedNum) {
          // plitəyə rəqəmi vermək
          selectedTile.textContent = selectedNum.textContent;
          // əgər rəqəm cavabdakı rəqəmlə uyuşursa
          if (checkCorrect(selectedTile)) {
              // plitələrin seçimin ləğv etmək
              selectedTile.classList.remove("selected");
              selectedNum.classList.remove("selected");
              // seçili dəyişənləri silmək
              selectedNum = null;
              selectedTile = null;
              // Lövhənin tamamlanıb-tamamlanmadığını yoxlamaq
              if (checkDone()) {
                  endGame();
              };
          }// əgər rəqəmlə cavab uyuşmursa
          else {
              // 1 saniyəlik yeni rəqəm seçməni dayandırmaq
              disableSelect = true;
              // plitəni qırmızıya çevirmək
              selectedTile.classList.add("incorrect");
              // 1 saniyə içində işləyəcək
              setTimeout(function(){
                // canlardan 1-ni azaltmaq
                lives --;
                // əgər oyunda can qalmıyıbsa
                if (lives === 0) {
                    endGame();
                } else {
                    // can var isə 
                    // can sayını azaltmaq
                    id("lives").textContent = "lives remains: " + lives;
                    // rəqəm və plitə yenidən seçilə biləcək
                    disableSelect = false;
                }
                // plitənin rəngini düzəltmək və seçimi 2-indən də ləğv etmək
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                // plitəni və seçilmiş dəyişənləri təmizləmək
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;

              }, 1000)
          }
      }
  }

  function checkDone() {
      let tiles = qsa(".tile");
      for (let i = 0; i < tiles.length; i++){
          if(tiles[i].textContent === "") return false;
      }
      return true;
  }

  function endGame() {
      // daxiletməni dayandırmaq və taymeri dayandırmaq
      disableSelect = true;
      clearTimeout(timer);
      // udub-uduzma mesajını göstərmək
      if (lives === 0 || timeRemaining === 0) {
          id("lives").textContent = "loser!";
      } else {
          id("lives").textContent = "you won!";
      }
  }

  function checkCorrect(tile) {
      // cavabın doğruluğun yoxla çətinliyi nəzərə alaraq
      if (id("diff-1").checked) solution = easy[1];
      else if (id("diff-2").checked) solution = medium[1];
      else solution = hard[1];
      // əgər cavabla plitənin qiyməti uyuşursa
      if (solution.charAt(tile.id) === tile.textContent) return true;
      else return false;
  }
  function clearPrevious() {
      //bütün plitələrlə əlaqə 
      let tiles = qsa(".tile");
      // hər bir plitəni silmək
      for (let i = 0; i < tiles.length; i++){
        tiles[i].remove();
      }
      // əgər taymer varsa onu da sıfırlamaq
      if(timer) clearTimeout(timer);
      //seçili rəqəmləri sıfırlamaq
      for (let i = 0; i < id("number-container").children.length; i++){
          id("number-container").children[i].classList.remove("selected");
      }
      //seçili dəyişənləri sıfırlamaq
      selectedTile = null;
      selectedNum = null;
  }
  //Köməkçi funksiyalar

  function id(id) {
      return document.getElementById(id);
  }
  function qs(selector) {
      return document.querySelector(selector);
  }
  function qsa(selector) {
      return document.querySelectorAll(selector);
  }
