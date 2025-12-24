// Аудиогид для сайта "Золотые Звёзды Северян" - исправленная версия
class AudioGuide {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.rate = 1.0;
    this.voice = null;
    this.isPaused = false;
    this.autoPlayEnabled = false;
    this.speechQueue = [];
    this.isProcessingQueue = false;
    
    this.audioContent = {
      welcome: "Добро пожаловать на сайт «Золотые Звёзды Северян». Этот проект посвящён героям-северянам Великой Отечественной войны, описанным в книге Р.А. Овсянкина. Здесь представлены 10 реальных героев из Архангельской области, удостоенных звания Героя Советского Союза.",
      info: "В разделе 'Герои-северяне' представлены 10 героев из книги Р.А. Овсянкина. Каждый из них совершил выдающийся подвиг во время Великой Отечественной войны. На интерактивной карте отмечены места их рождения и подвигов. Вы можете выбрать любого героя для просмотра подробной информации.",
      awards: "Раздел 'Боевые награды' содержит информацию о орденах и медалях, которыми были удостоены герои-северяне. Здесь представлены награды различного уровня, включая высшую награду — медаль «Золотая Звезда» Героя Советского Союза, Орден Ленина, Орден Красного Знамени и другие.",
      monuments: "В разделе 'Памятники и мемориалы' вы найдёте информацию о местах памяти, посвящённых героям-северянам и их подвигам. Это мемориалы, музеи и памятники в разных городах России, которые сохраняют память о подвигах наших героев.",
      events: "Раздел 'Исторические события' показывает хронологию важных событий Великой Отечественной войны, в которых участвовали северяне. От начала войны в 1941 году до Дня Победы в 1945 году.",
      quiz: "Раздел 'Тест на знание истории' позволяет проверить свои знания о героях-северянах в интерактивном тесте. Тест имеет три уровня сложности: лёгкий (5 вопросов), средний (10 вопросов) и сложный (15 вопросов).",
      sources: "Проект основан на книге Р.А. Овсянкина «Золотые звёзды северян» и других исторических источниках.",
      about: "Этот проект создан для сохранения памяти о героях-северянах и их подвигах во время Великой Отечественной войны. Мы помним и чтим их подвиг.",
      contacts: "По вопросам сотрудничества и предложениям вы можете связаться с администрацией проекта."
    };
    
    this.init();
  }
  
  init() {
    // Ждем загрузки голосов
    setTimeout(() => this.loadVoices(), 1000);
    this.setupEventListeners();
    
    // Проверяем сохраненные настройки
    const savedAutoPlay = localStorage.getItem('audioGuideAutoPlay');
    if (savedAutoPlay === 'true') {
      this.autoPlayEnabled = true;
      this.updateToggleUI();
    }
  }
  
  loadVoices() {
    const voices = this.synth.getVoices();
    
    // Ищем русские голоса
    const russianVoices = voices.filter(v => v.lang.includes('ru'));
    this.voice = russianVoices.length > 0 ? russianVoices[0] : voices[0];
    
    // Обновляем список голосов
    const voiceSelect = document.getElementById('audio-voice');
    if (voiceSelect) {
      voiceSelect.innerHTML = '';
      
      voices.forEach(voice => {
        if (voice.lang.includes('ru') || voice.lang.includes('en')) {
          const option = document.createElement('option');
          option.value = voice.lang;
          option.textContent = `${voice.name} (${voice.lang})`;
          voiceSelect.appendChild(option);
        }
      });
      
      // Выбираем русский голос по умолчанию
      const russianVoice = voices.find(v => v.lang === 'ru-RU');
      if (russianVoice) {
        voiceSelect.value = 'ru-RU';
      }
    }
  }
  
  setupEventListeners() {
    // Кнопки управления в аудиогиде
    const playBtn = document.getElementById('audio-play');
    const pauseBtn = document.getElementById('audio-pause');
    const stopBtn = document.getElementById('audio-stop');
    const speedBtn = document.getElementById('audio-speed');
    const audioToggle = document.getElementById('audio-toggle');
    const voiceSelect = document.getElementById('audio-voice');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => this.describeCurrentSection());
    }
    
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.togglePause());
    }
    
    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.stop());
    }
    
    if (speedBtn) {
      speedBtn.addEventListener('click', () => this.changeSpeed());
    }
    
    if (audioToggle) {
      audioToggle.addEventListener('click', () => this.toggleAutoPlay());
    }
    
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => this.changeVoice(e.target.value));
    }
    
    // Секции для автоматического воспроизведения
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Автоматическое воспроизведение при переходе по секциям
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (e.preventDefault) e.preventDefault();
        
        setTimeout(() => {
          const section = link.dataset.section;
          if (section && this.autoPlayEnabled) {
            this.describeSection(section);
          }
        }, 1000);
      });
    });
    
    // Воспроизведение при открытии деталей героя
    document.addEventListener('heroDetailOpened', (e) => {
      if (this.autoPlayEnabled && e.detail && e.detail.hero) {
        this.describeHero(e.detail.hero);
      }
    });
    
    // Воспроизведение при клике на ссылки в футере
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const audioSection = link.dataset.audio;
        if (audioSection && this.audioContent[audioSection]) {
          this.speak(this.audioContent[audioSection]);
        }
      });
    });
  }
  
  describeSection(sectionId) {
    const content = this.audioContent[sectionId];
    if (content) {
      this.speak(content);
    }
  }
  
  describeCurrentSection() {
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
      const sectionId = activeSection.id;
      this.describeSection(sectionId);
    }
  }
  
  speak(text, callback) {
    // Очищаем очередь
    this.speechQueue = [];
    this.stop();
    
    if (!this.synth) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    if (!text || text.trim() === '') {
      if (callback) callback();
      return;
    }
    
    // Разбиваем длинный текст на части
    const sentences = this.splitIntoSentences(text);
    
    if (sentences.length === 1) {
      // Для короткого текста используем стандартный подход
      this.speakSentence(sentences[0], callback);
    } else {
      // Для длинного текста используем очередь
      this.speechQueue = sentences;
      this.isProcessingQueue = true;
      this.processQueue(callback);
    }
  }
  
  splitIntoSentences(text) {
    // Простое разбиение на предложения
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim() + '.');
  }
  
  speakSentence(sentence, callback) {
    this.currentUtterance = new SpeechSynthesisUtterance(sentence);
    this.currentUtterance.rate = this.rate;
    this.currentUtterance.voice = this.voice;
    this.currentUtterance.lang = this.voice?.lang || 'ru-RU';
    
    this.currentUtterance.onstart = () => {
      this.isSpeaking = true;
      this.updateAudioStatus(true);
      this.updateProgressBar();
    };
    
    this.currentUtterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.updateAudioStatus(false);
      this.resetProgressBar();
      if (callback) callback();
    };
    
    this.currentUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      this.isPaused = false;
      this.updateAudioStatus(false);
      this.resetProgressBar();
      if (callback) callback();
    };
    
    this.currentUtterance.onboundary = (event) => {
      // Обновляем прогресс для длинных текстов
      if (event.name === 'sentence' || event.name === 'word') {
        this.updateProgressBar();
      }
    };
    
    this.synth.speak(this.currentUtterance);
  }
  
  processQueue(callback) {
    if (!this.isProcessingQueue || this.speechQueue.length === 0) {
      this.isProcessingQueue = false;
      if (callback) callback();
      return;
    }
    
    const sentence = this.speechQueue.shift();
    this.speakSentence(sentence, () => {
      // Рекурсивно обрабатываем следующее предложение
      setTimeout(() => this.processQueue(callback), 100);
    });
  }
  
  describeHero(hero) {
    const text = `${hero.fio}. Годы жизни: ${hero.years}. Место рождения: ${hero.birthplace}. ${hero.profession}. ${hero.deeds}`;
    this.speak(text);
  }
  
  togglePause() {
    if (this.isSpeaking) {
      if (this.isPaused) {
        this.synth.resume();
        this.isPaused = false;
      } else {
        this.synth.pause();
        this.isPaused = true;
      }
      this.updatePauseButton();
    }
  }
  
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.speechQueue = [];
    this.isProcessingQueue = false;
    this.updateAudioStatus(false);
    this.resetProgressBar();
    this.updatePauseButton();
  }
  
  changeSpeed() {
    this.rate = this.rate === 1.0 ? 1.5 : this.rate === 1.5 ? 0.75 : 1.0;
    
    // Обновляем текущее произношение
    if (this.currentUtterance && this.isSpeaking) {
      this.synth.cancel();
      // Перезапускаем с новой скоростью
      setTimeout(() => {
        if (this.speechQueue.length > 0) {
          // Если есть очередь, перезапускаем всю очередь
          const currentText = this.speechQueue.join(' ');
          this.speak(currentText);
        } else if (this.currentUtterance) {
          this.speak(this.currentUtterance.text);
        }
      }, 100);
    }
    
    // Показываем уведомление
    this.updateSpeedButton();
  }
  
  changeVoice(lang) {
    const voices = this.synth.getVoices();
    this.voice = voices.find(v => v.lang === lang) || voices[0];
    
    // Обновляем текущее произношение
    if (this.currentUtterance && this.isSpeaking) {
      this.synth.cancel();
      setTimeout(() => {
        this.speak(this.currentUtterance.text);
      }, 100);
    }
  }
  
  toggleAutoPlay() {
    this.autoPlayEnabled = !this.autoPlayEnabled;
    this.updateToggleUI();
    
    // Сохраняем настройку
    localStorage.setItem('audioGuideAutoPlay', this.autoPlayEnabled);
    
    // Воспроизводим уведомление
    if (this.autoPlayEnabled) {
      this.speak("Автогид включен");
    }
  }
  
  updateToggleUI() {
    const audioToggle = document.getElementById('audio-toggle');
    
    if (audioToggle) {
      if (this.autoPlayEnabled) {
        audioToggle.classList.add('active');
        audioToggle.title = 'Автогид включен';
        audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else {
        audioToggle.classList.remove('active');
        audioToggle.title = 'Автогид выключен';
        audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      }
    }
  }
  
  updateSpeedButton() {
    const speedBtns = document.querySelectorAll('[id*="audio-speed"]');
    speedBtns.forEach(btn => {
      btn.title = `Скорость: ${this.rate}x`;
      const speedIndicator = btn.querySelector('.speed-indicator');
      if (speedIndicator) {
        speedIndicator.textContent = `${this.rate}x`;
      }
    });
  }
  
  updatePauseButton() {
    const pauseBtns = document.querySelectorAll('[id*="audio-pause"]');
    pauseBtns.forEach(btn => {
      if (this.isPaused) {
        btn.innerHTML = '<i class="fas fa-play"></i>';
        btn.title = 'Продолжить воспроизведение';
      } else {
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        btn.title = 'Приостановить воспроизведение';
      }
    });
  }
  
  updateAudioStatus(isSpeaking) {
    const statusIndicators = document.querySelectorAll('.audio-status-indicator');
    
    statusIndicators.forEach(indicator => {
      if (isSpeaking) {
        indicator.style.backgroundColor = 'var(--success)';
        indicator.classList.add('pulsing');
      } else {
        indicator.style.backgroundColor = 'var(--light-secondary)';
        indicator.classList.remove('pulsing');
      }
    });
  }
  
  updateProgressBar() {
    const progressBars = document.querySelectorAll('.audio-progress > div');
    if (progressBars.length === 0) return;
    
    // Анимация пульсации во время речи
    progressBars.forEach(bar => {
      bar.style.width = '100%';
      bar.style.transition = 'width 30s linear';
    });
  }
  
  resetProgressBar() {
    const progressBars = document.querySelectorAll('.audio-progress > div');
    progressBars.forEach(bar => {
      bar.style.width = '0%';
      bar.style.transition = 'width 0.3s ease';
    });
  }
}

// Инициализация аудиогида при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    window.audioGuide = new AudioGuide();
    
    // Воспроизводим приветственное сообщение
    setTimeout(() => {
      if (localStorage.getItem('audioGuideAutoPlay') === 'true') {
        window.audioGuide.autoPlayEnabled = true;
        window.audioGuide.updateToggleUI();
        
        // Ждем немного перед воспроизведением
        setTimeout(() => {
          window.audioGuide.speak(window.audioGuide.audioContent.welcome);
        }, 1500);
      }
    }, 2000);
    
  } else {
    console.warn('Speech synthesis not supported');
    
    // Скрываем элементы аудиогида
    const audioElements = document.querySelectorAll('.audio-guide-container');
    audioElements.forEach(el => {
      el.style.display = 'none';
    });
    
    // Показываем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification warning';
    notification.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>Аудиогид не поддерживается вашим браузером</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
  }
});