// js/script.js
// Manual wooden-fish clicks with weighted rewards, Fortune Slips & Answer tips
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // --- Element references ---
    const fish        = document.getElementById('wooden-fish');
    const countEl     = document.getElementById('merit-count');
    const toast       = document.getElementById('toast');
    const bgMusic     = document.getElementById('bg-music');
    const fortuneBtn  = document.getElementById('fortune-btn');
    const fortuneDisp = document.getElementById('fortune-display');
    const answerBtn   = document.getElementById('answer-btn');
    const answerDisp  = document.getElementById('answer-display');
    if (![fish, countEl, toast, bgMusic, fortuneBtn, fortuneDisp, answerBtn, answerDisp]
          .every(el => el)) return;

    // --- Configuration constants ---
    const REWARD_TIERS = [
      { value: 10, probability: 0.01 },
      { value:  5, probability: 0.09 },
      { value:  1, probability: 0.90 }
    ];
    const FORTUNE_COST        = 30;
    const ANSWER_COST         = 15;
    const MAX_FORTUNE_PER_DAY = 3;
    const DAY_MS              = 24 * 60 * 60 * 1000;

    const FORTUNE_SLIPS = [
      '风雨之后见彩虹',
      '塞翁失马，焉知非福',
      '心静自然凉',
      '行稳致远',
      '守得云开见月明',
      '勿忘初心，方得始终',
      '贵人相助，前程似锦',
      '临渊羡鱼，不如退而结网',
      '静以修身，俭以养德',
      '一寸光阴一寸金',
      '众人拾柴火焰高',
      '山重水复疑无路，柳暗花明又一村',
      '读万卷书，行万里路',
      '物极必反',
      '自助者天助',
      'Patience brings good fortune.',
      'Every cloud has a silver lining.',
      'Good things come to those who wait.',
      'Actions speak louder than words.',
      'Don’t be afraid to start over.',
      'Where there’s a will, there’s a way.',
      'Help will come when you need it most.',
      'Trust your intuition.',
      'Small steps lead to big achievements.',
      'Hard work pays off in the end.',
      'Kindness will be rewarded.',
      'Learn from yesterday, live for today.',
      'Unexpected luck is on its way.',
      'Embrace change for new opportunities.',
      'Let go of what you can’t control.'
    ];

    const ANSWER_SUGGESTIONS = [
      '大胆尝试。',
      'Trust the process.',
      '现在就行动。',
      'Try something new.',
      '别太在意别人的看法。',
      'Take a break and come back later.',
      '适当停下来休息一下。',
      'Enjoy the journey, not just the result.',
      '保持耐心。',
      'Your instincts are right.',
      '相信你的直觉。',
      'Say what’s on your mind.',
      '微笑面对难题。',
      'Sometimes, waiting is the answer.',
      '换个角度试试。',
      'Be gentle with yourself.',
      '答案就在你心里。',
      'Give yourself more credit.',
      '放轻松，这很重要。',
      'Don’t be afraid to start over.',
      '主动一点，会有收获。',
      'A little adventure won’t hurt.',
      '偶尔放空，也是成长。',
      'Choose kindness, always.',
      '喝杯奶茶再决定。',
      'Let go of what you can’t control.',
      '顺其自然。',
      'Take things step by step.',
      '学会说“不”。',
      'Listen more, judge less.',
      '你的快乐比什么都重要。',
      'Focus on what matters most.',
      '再坚持一下。',
      'Say yes to new opportunities.',
      '适时断舍离。',
      'What you seek is also seeking you.',
      '保持开放的心态。',
      'Ask for help if needed.',
      '生活不会亏待努力的人。',
      'Enjoy the small wins.',
      '所有答案都在路上。',
      'Your timing is perfect.',
      '给自己多一点信心。',
      'Speak up—you’ll be heard.',
      '认真生活，慢慢变好。',
      'Smile more, worry less.',
      '你的好运正在加载中。',
      'It’s okay to change your mind.',
      '一切都是最好的安排。',
      'Embrace the unexpected.'
    ];

    // --- State & helpers ---
    let count = parseInt(localStorage.getItem('peeboMerit')) || 0;
    countEl.textContent = count;
    let busy = false;

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 800);
    }

    function saveCount(n) {
      count = n;
      countEl.textContent = count;
      try { localStorage.setItem('peeboMerit', count); }
      catch (e) { console.error('Failed to save merit count', e); }
    }

    function getRandomReward() {
      const r = Math.random();
      let cum = 0;
      for (const t of REWARD_TIERS) {
        cum += t.probability;
        if (r <= cum) return t.value;
      }
      return 1;
    }

    // --- Handlers ---
    function handleFishClick() {
      if (busy) return;
      busy = true;
      setTimeout(() => busy = false, 200);

      const reward = getRandomReward();
      try { new Audio('audio/wooden-fish.mp3').play(); } catch {}
      fish.classList.add('bounce');
      setTimeout(() => fish.classList.remove('bounce'), 300);

      saveCount(count + reward);
      if (count % 15 === 0) showToast(`Hooray! ${count} merits!`);
      else             showToast(`+${reward} Merit${reward>1?'s':''}!`);
    }

    function getRecentFortunes() {
      const arr = JSON.parse(localStorage.getItem('fortuneUses') || '[]');
      const now = Date.now();
      const recent = arr.filter(ts => now - ts < DAY_MS);
      localStorage.setItem('fortuneUses', JSON.stringify(recent));
      return recent;
    }

    function handleFortune() {
      const used = getRecentFortunes();
      if (used.length >= MAX_FORTUNE_PER_DAY) {
        return showToast('You’ve reached today’s limit.');
      }
      if (count < FORTUNE_COST) {
        return showToast('Not enough merits.');
      }
      saveCount(count - FORTUNE_COST);
      used.push(Date.now());
      localStorage.setItem('fortuneUses', JSON.stringify(used));

      const slip = FORTUNE_SLIPS[
        Math.floor(Math.random() * FORTUNE_SLIPS.length)
      ];
      fortuneDisp.textContent = slip;
      showToast('Fortune slip unlocked!');
    }

    function handleAnswer() {
      if (count < ANSWER_COST) {
        return showToast('Not enough merits.');
      }
      saveCount(count - ANSWER_COST);
      const tip = ANSWER_SUGGESTIONS[
        Math.floor(Math.random() * ANSWER_SUGGESTIONS.length)
      ];
      answerDisp.textContent = tip;
      showToast('Here’s your suggestion!');
    }

    // --- Initialization ---
    try { bgMusic.volume = 0.5; bgMusic.play(); } catch {}

    fish.addEventListener('click', handleFishClick);
    fish.addEventListener('keypress', e => {
      if (e.key === 'Enter') handleFishClick();
    });

    fortuneBtn .addEventListener('click', handleFortune);
    answerBtn  .addEventListener('click', handleAnswer);
  });
})();
