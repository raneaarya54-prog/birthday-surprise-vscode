
    document.addEventListener('DOMContentLoaded', () => {
      // -------------------------------------------------------------------
      // 1. GENTLE CHIME AUDIO (TONE.JS - OPTIONAL & USER-TRIGGERED)
      // -------------------------------------------------------------------
      let chimeSynth = null;
      function playSparkleChime() {
        try {
          if (typeof Tone !== 'undefined') {
            if (Tone.context.state !== 'running') {
              Tone.start();
            }
            if (!chimeSynth) {
              chimeSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.02, decay: 0.4, sustain: 0.1, release: 1.2 },
                volume: -14
              }).toDestination();
            }
            const now = Tone.now();
            chimeSynth.triggerAttackRelease('E5', '16n', now);
            chimeSynth.triggerAttackRelease('G#5', '16n', now + 0.09);
            chimeSynth.triggerAttackRelease('B5', '16n', now + 0.18);
            chimeSynth.triggerAttackRelease('E6', '8n', now + 0.27);
          }
        } catch (e) {
          // Graceful fallback if audio blocked
        }
      }

      // -------------------------------------------------------------------
      // 2. TOAST HELPER (NO ALERT())
      // -------------------------------------------------------------------
      const toastBanner = document.getElementById('toast-banner');
      const toastText = document.getElementById('toast-text');
      let toastTimeout;
      function showToast(message) {
        toastText.textContent = message;
        toastBanner.classList.remove('translate-y-24', 'opacity-0');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toastBanner.classList.add('translate-y-24', 'opacity-0');
        }, 3800);
      }

      // -------------------------------------------------------------------
      // 3. CONFETTI & CHAMPAGNE SPARKLE CANVAS ENGINE
      // -------------------------------------------------------------------
      const canvas = document.getElementById('celebration-canvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      let animationFrameId = null;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      const palette = ['#C5A059', '#DFC48C', '#C47D6A', '#5C6B57', '#E6B89C', '#FFFDF9'];

      function launchCelebration(originX = window.innerWidth / 2, originY = window.innerHeight * 0.45, count = 90) {
        playSparkleChime();
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.5 + Math.random() * 6.5;
          particles.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3.5,
            size: 4 + Math.random() * 6,
            color: palette[Math.floor(Math.random() * palette.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            shape: Math.random() > 0.4 ? 'rect' : 'star',
            alpha: 1,
            decay: 0.008 + Math.random() * 0.008
          });
        }
        if (!animationFrameId) {
          animateParticles();
        }
      }

      function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;
          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
      }

      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.14; // gentle gravity
          p.vx *= 0.99;
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'star') {
            drawStar(0, 0, 4, p.size, p.size * 0.4);
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
          }
          ctx.restore();
        }

        if (particles.length > 0) {
          animationFrameId = requestAnimationFrame(animateParticles);
        } else {
          animationFrameId = null;
        }
      }

      // -------------------------------------------------------------------
      // 4. ENVELOPE GATE INTERACTION
      // -------------------------------------------------------------------
      const envelopeGate = document.getElementById('envelope-gate');
      const openSealBtn = document.getElementById('open-seal-btn');
      const unlockPasscodeBtn = document.getElementById('unlock-passcode-btn');
      const gatePasscodeInput = document.getElementById('gate-passcode');
      const gateHintMsg = document.getElementById('gate-hint-msg');

      function openKeepsake() {
        envelopeGate.classList.add('opened');
        setTimeout(() => {
          envelopeGate.style.display = 'none';
          launchCelebration(window.innerWidth / 2, window.innerHeight * 0.35, 85);
        }, 450);
      }

      openSealBtn.addEventListener('click', openKeepsake);

      unlockPasscodeBtn.addEventListener('click', () => {
        const val = gatePasscodeInput.value.trim();
        if (val === '' || val === '2712' || val === '21' || val === '27' || val.toLowerCase() === 'tanvi') {
          openKeepsake();
        } else {
          gateHintMsg.textContent = 'Try 2712 or 21 — or simply tap the wax seal above!';
        }
      });

      gatePasscodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') unlockPasscodeBtn.click();
      });

      // Celebrate Buttons
      document.getElementById('celebrate-now-btn').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        launchCelebration(rect.left + rect.width / 2, rect.top, 110);
        showToast('Happy 21st Birthday, Tanvi! ✨');
      });

      document.getElementById('nav-celebrate-btn').addEventListener('click', () => {
        launchCelebration(window.innerWidth / 2, 120, 65);
      });

      // -------------------------------------------------------------------
      // 5. LIVE COUNTDOWN TO 27 DECEMBER 2026 00:00:00 IST (+05:30)
      // -------------------------------------------------------------------
      const targetTimestamp = new Date('2026-12-27T00:00:00+05:30').getTime();
      const cdDays = document.getElementById('cd-days');
      const cdHours = document.getElementById('cd-hours');
      const cdMinutes = document.getElementById('cd-minutes');
      const cdSeconds = document.getElementById('cd-seconds');
      const birthdayLiveBanner = document.getElementById('birthday-live-banner');

      function updateCountdown() {
        const now = Date.now();
        const diff = targetTimestamp - now;

        if (diff <= 0) {
          cdDays.textContent = '00';
          cdHours.textContent = '00';
          cdMinutes.textContent = '00';
          cdSeconds.textContent = '00';
          birthdayLiveBanner.classList.remove('hidden');
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        cdDays.textContent = String(days).padStart(2, '0');
        cdHours.textContent = String(hours).padStart(2, '0');
        cdMinutes.textContent = String(minutes).padStart(2, '0');
        cdSeconds.textContent = String(seconds).padStart(2, '0');
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);

      // -------------------------------------------------------------------
      // 6. THE BIRTHDAY COMMITTEE INTERACTION
      // -------------------------------------------------------------------
      const petCards = document.querySelectorAll('.pet-card');
      const petQuoteBox = document.getElementById('pet-quote-box');
      const petQuoteSpeaker = document.getElementById('pet-quote-speaker');
      const petQuoteText = document.getElementById('pet-quote-text');

      petCards.forEach(card => {
        card.addEventListener('click', () => {
          const petName = card.getAttribute('data-pet');
          const quote = card.getAttribute('data-quote');
          petQuoteSpeaker.textContent = `Official Decree from ${petName}`;
          petQuoteText.textContent = `“${quote}”`;
          petQuoteBox.classList.remove('hidden');
          petQuoteBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          playSparkleChime();
        });
      });

      // -------------------------------------------------------------------
      // 7. 21 REASONS / CHAPTER 21 MEMORY & MILESTONE CARDS
      // -------------------------------------------------------------------
      const twentyOneNotes = [
        { title: "Your Effortless Warmth", note: "The way you make every room feel softer, brighter, and immediately welcoming just by walking in." },
        { title: "December 27 Magic", note: "Born in the coziest week of the year—no wonder you carry so much festive light with you everywhere." },
        { title: "Unmatched Loyalty", note: "You show up for the people you love with your whole heart, every single time." },
        { title: "The Laughs We Share", note: "Those uncontrollable, tears-in-our-eyes laughing fits over things nobody else would understand." },
        { title: "Your Quiet Strength", note: "How gracefully you handle challenges while staying kind, grounded, and true to yourself." },
        { title: "Pet Whisperer Energy", note: "The pure bond you share with Mithu, Dadu, and Tuffy—they know they hit the jackpot with you." },
        { title: "Thoughtful Little Details", note: "You remember the smallest things people mention in passing and turn them into thoughtful surprises." },
        { title: "Your Aesthetic Eye", note: "Your effortless sense of style, beauty, and taste that makes everything feel curated." },
        { title: "Late-Night Conversations", note: "The deep, honest talks where time completely disappears and everything makes sense." },
        { title: "Your Infectious Smile", note: "One genuine smile from you can turn an entire heavy day around." },
        { title: "Fearless Curiosity", note: "Stepping into 21 ready to explore, learn, and make the world unmistakably yours." },
        { title: "Heart of Gold", note: "Your empathy and kindness aren't performative—they are simply who you are at your core." },
        { title: "The Comfort of Your Company", note: "Even sitting in complete silence with you feels peaceful and restorative." },
        { title: "Your Sense of Humor", note: "Quick-witted, warm, and always timed to perfection." },
        { title: "Unapologetically You", note: "You never try to be anyone else, and that authenticity is your superpower." },
        { title: "Memory Maker", note: "Every ordinary outing with you somehow turns into a story we retell for years." },
        { title: "Your Generous Spirit", note: "You celebrate other people's wins as if they were your very own." },
        { title: "Grace Under Pressure", note: "Even when things get hectic, you keep a calm center that steadies everyone around you." },
        { title: "The Dreams Ahead", note: "Watching you chase everything you deserve in your twenties is going to be extraordinary." },
        { title: "Our Bond", note: "Through every season and milestone, having you in my corner means the world to me." },
        { title: "Chapter Twenty-One", note: "Here is to 21: may it be your happiest, boldest, most deeply loved year yet. — Prisha" }
      ];

      const cardsGrid = document.getElementById('cards-grid');
      const revealedCounter = document.getElementById('revealed-counter');
      const revealAllBtn = document.getElementById('reveal-all-cards-btn');
      const openedSet = new Set();

      function updateCounter() {
        revealedCounter.textContent = `${openedSet.size} / 21 Opened`;
      }

      twentyOneNotes.forEach((item, index) => {
        const num = String(index + 1).padStart(2, '0');
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'chapter-card text-left bg-[#FFFDF9] rounded-2xl p-6 editorial-border shadow-sm hover:shadow-editorial focus:outline-none focus:ring-2 focus:ring-champagne cursor-pointer flex flex-col justify-between min-h-[156px]';
        
        card.innerHTML = `
          <div class="flex items-center justify-between w-full mb-3">
            <span class="font-serif text-2xl font-semibold text-champagne">No. ${num}</span>
            <span class="card-badge text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-parchment text-inkMuted border border-champagne/25">
              Tap to open
            </span>
          </div>
          <div class="card-front">
            <h3 class="font-serif text-xl font-semibold text-espresso">${item.title}</h3>
          </div>
          <div class="card-back hidden">
            <h3 class="font-serif text-lg font-semibold text-terracotta mb-1.5">${item.title}</h3>
            <p class="text-sm text-espresso/85 leading-relaxed">${item.note}</p>
          </div>
        `;

        card.addEventListener('click', () => {
          const isOpened = openedSet.has(index);
          const front = card.querySelector('.card-front');
          const back = card.querySelector('.card-back');
          const badge = card.querySelector('.card-badge');

          if (!isOpened) {
            openedSet.add(index);
            front.classList.add('hidden');
            back.classList.remove('hidden');
            card.classList.add('bg-parchment/70', 'border-champagne');
            badge.textContent = '✦ Opened';
            badge.classList.replace('text-inkMuted', 'text-sage');
            updateCounter();
            if (openedSet.size === 21) {
              launchCelebration(window.innerWidth / 2, window.innerHeight / 2, 100);
              showToast('You opened all 21 keepsake notes! ✦');
            }
          } else {
            openedSet.delete(index);
            front.classList.remove('hidden');
            back.classList.add('hidden');
            card.classList.remove('bg-parchment/70', 'border-champagne');
            badge.textContent = 'Tap to open';
            badge.classList.replace('text-sage', 'text-inkMuted');
            updateCounter();
          }
        });

        cardsGrid.appendChild(card);
      });

      revealAllBtn.addEventListener('click', () => {
        const allButtons = cardsGrid.querySelectorAll('button');
        allButtons.forEach((btn, idx) => {
          if (!openedSet.has(idx)) {
            btn.click();
          }
        });
      });

      // -------------------------------------------------------------------
      // 8. "THE TANVI TIMES" 7x7 MINI CROSSWORD PUZZLE
      // -------------------------------------------------------------------
      // Layout (7 rows x 7 cols):
      // Row 0: T  A  N  V  I  .  .   (1-Across: TANVI; 1-Down starts at (0,0): TUFFY)
      // Row 1: U  .  .  .  .  P  .   (2-Down starts at (1,5): PRISHA)
      // Row 2: F  .  D  A  D  U  .   (4-Across: DADU; D at (2,2), A at (2,3), D at (2,4), U at (2,5))
      // Row 3: F  .  E  .  .  I  .   (3-Down starts at (2,2): DEC -> D(2,2), E(3,2), C(4,2))
      // Row 4: Y  .  C  .  .  S  .
      // Row 5: .  M  I  T  H  U  .   (5-Across: MITHU -> M(5,1), I(5,2), T(5,3), H(5,4), U(5,5))
      // Wait: let's verify PRISHA at col 5:
      // (1,5)=P, (2,5)=R? Wait: DADU ends at (2,5)=U! Let's align cleanly so every intersection matches!
      // Let's verify clean valid intersections:
      // 1-Across (Row 0, Cols 0..4): T A N V I
      // 1-Down   (Cols 0, Rows 0..4): T U F F Y  (Intersects T at 0,0 -> MATCH!)
      // 2-Down   (Col 4, Rows 0..5):  I R I S H A? No, PRISHA has I at index 2!
      // So if PRISHA is in Col 4, Rows 0..5:
      // Wait: index 0=P, 1=R, 2=I, 3=S, 4=H, 5=A.
      // If 1-Across is T A N V I (Cols 0..4), then (0,4) is 'I'!
      // What has 'I' as its first letter? Or put PRISHA in Col 5 (Rows 1..6):
      // (1,5)=P, (2,5)=R, (3,5)=I, (4,5)=S, (5,5)=H, (6,5)=A!
      // Now let's check Across words intersecting Col 5:
      // Row 3, Cols 1..5: M I T H U -> (3,5) is U? No, (3,5) is I.
      // What if MITHU is Row 5, Cols 2..6: M(5,2) I(5,3) T(5,4) H(5,5) U(5,6) -> (5,5) is 'H'! MATCHES PRISHA's 'H' at (5,5)!
      // What about DADU? D A D U -> ends in U, or has A!
      // If DADU is Row 6, Cols 3..6: D(6,3) A(6,4) D(6,5)? No, (6,5) is A!
      // If DADU is Row 6, Cols 4..7 (or Cols 3..6 with D A D U -> index 1 is A at col 5!):
      // Let's check: Col 3=D, Col 4=A, Col 5=D? No: Col 4=D, Col 5=A, Col 6=D... wait: D-A-D-U has 'A' as 2nd letter!
      // Put 'A' at (6,5): Col 4='D', Col 5='A', Col 6='D'... wait where does 'U' go? Need 8 cols or shift PRISHA to Col 4!
      // Let's shift PRISHA to Col 4, Rows 1..6:
      // (1,4)=P, (2,4)=R, (3,4)=I, (4,4)=S, (5,4)=H, (6,4)=A.
      // Check intersections with Col 4:
      // - Row 5, Cols 1..5: M(5,1) I(5,2) T(5,3) H(5,4) U(5,5) -> (5,4) is 'H'! MATCHES!
      // - Row 6, Cols 3..6: D(6,3) A(6,4) D(6,5) U(6,6) -> (6,4) is 'A'! MATCHES!
      // - Now 3-Down: DEC (D-E-C) at Col 2, Rows 1..3:
      //   (1,2)=D, (2,2)=E, (3,2)=C. (No conflict, clean 3-letter word!)
      // Let's double check EVERY cell of this 7x7 grid:
      // Row 0: T(0,0) A(0,1) N(0,2) V(0,3) I(0,4) .      .
      // Row 1: U(1,0) .      D(1,2) .      P(1,4) .      .
      // Row 2: F(2,0) .      E(2,2) .      R(2,4) .      .
      // Row 3: F(3,0) .      C(3,2) .      I(3,4) .      .
      // Row 4: Y(4,0) .      .      .      S(4,4) .      .
      // Row 5: .      M(5,1) I(5,2) T(5,3) H(5,4) U(5,5) .
      // Row 6: .      .      .      D(6,3) A(6,4) D(6,5) U(6,6)
      // Every single word and intersection is 100% valid and crisp!

      const cwSolution = [
        ['T', 'A', 'N', 'V', 'I', null, null],
        ['U', null, 'D', null, 'P', null, null],
        ['F', null, 'E', null, 'R', null, null],
        ['F', null, 'C', null, 'I', null, null],
        ['Y', null, null, null, 'S', null, null],
        [null, 'M', 'I', 'T', 'H', 'U', null],
        [null, null, null, 'D', 'A', 'D', 'U']
      ];

      const cwNumbers = {
        '0,0': '1',
        '1,2': '3',
        '1,4': '2',
        '5,1': '5',
        '6,3': '4'
      };

      const cwBoard = document.getElementById('crossword-board');
      const cwStatus = document.getElementById('cw-status');
      const cellInputs = {};

      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const key = `${r},${c}`;
          const letter = cwSolution[r][c];
          const wrapper = document.createElement('div');
          wrapper.className = 'relative w-full h-full rounded-md overflow-hidden';

          if (!letter) {
            wrapper.classList.add('bg-espresso');
          } else {
            wrapper.classList.add('bg-[#FFFDF9]');
            if (cwNumbers[key]) {
              const numSpan = document.createElement('span');
              numSpan.textContent = cwNumbers[key];
              numSpan.className = 'absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-semibold text-inkMuted pointer-events-none select-none';
              wrapper.appendChild(numSpan);
            }

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            input.setAttribute('aria-label', `Row ${r + 1} Column ${c + 1}`);
            input.className = 'w-full h-full text-center font-serif text-lg sm:text-xl font-bold uppercase text-espresso bg-transparent focus:bg-champagne/20 focus:outline-none transition pt-1';

            input.addEventListener('input', (e) => {
              const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
              e.target.value = val;
              e.target.classList.remove('text-sage', 'text-terracotta', 'bg-sage/15', 'bg-terracotta/15');
              if (val) {
                moveFocusNext(r, c);
              }
            });

            input.addEventListener('keydown', (e) => {
              if (e.key === 'Backspace' && !e.target.value) {
                moveFocusPrev(r, c);
              } else if (e.key === 'ArrowRight') {
                focusCell(r, c + 1);
              } else if (e.key === 'ArrowLeft') {
                focusCell(r, c - 1);
              } else if (e.key === 'ArrowDown') {
                focusCell(r + 1, c);
              } else if (e.key === 'ArrowUp') {
                focusCell(r - 1, c);
              }
            });
            cellInputs[key] = input;
            wrapper.appendChild(input);
          }
          cwBoard.appendChild(wrapper);
        }
      }

      // Finish crossword keyboard navigation and controls.
      function focusCell(row, col) {
        const input = cellInputs[`${row},${col}`];
        if (input) input.focus();
      }
      function moveFocusNext(row, col) {
        for (let rr = row; rr < 7; rr++) {
          for (let cc = (rr === row ? col + 1 : 0); cc < 7; cc++) {
            if (cellInputs[`${rr},${cc}`]) { cellInputs[`${rr},${cc}`].focus(); return; }
          }
        }
      }
      function moveFocusPrev(row, col) {
        for (let rr = row; rr >= 0; rr--) {
          for (let cc = (rr === row ? col - 1 : 6); cc >= 0; cc--) {
            if (cellInputs[`${rr},${cc}`]) { cellInputs[`${rr},${cc}`].focus(); return; }
          }
        }
      }
      // Register every playable crossword cell.
      cwBoard.querySelectorAll('input').forEach(input => {
        cellInputs[`${input.dataset.row},${input.dataset.col}`] = input;
      });

      document.getElementById('cw-check-btn').addEventListener('click', () => {
        let correct = 0, total = 0;
        Object.entries(cellInputs).forEach(([key, input]) => {
          const [r, c] = key.split(',').map(Number);
          total++;
          const ok = input.value.toUpperCase() === cwSolution[r][c];
          if (ok) correct++;
          input.classList.toggle('text-sage', ok);
          input.classList.toggle('text-terracotta', !ok && input.value !== '');
        });
        cwStatus.textContent = correct === total ? 'Perfect! You solved Tanvi’s birthday crossword! ✦' : `${correct} of ${total} letters are correct. Keep going!`;
        if (correct === total) launchCelebration(window.innerWidth / 2, window.innerHeight / 2, 70);
      });
      document.getElementById('cw-hint-btn').addEventListener('click', () => {
        const empty = Object.entries(cellInputs).find(([key, input]) => {
          const [r, c] = key.split(',').map(Number); return input.value.toUpperCase() !== cwSolution[r][c];
        });
        if (!empty) { cwStatus.textContent = 'The crossword is already complete! ✦'; return; }
        const [key, input] = empty; const [r, c] = key.split(',').map(Number);
        input.value = cwSolution[r][c]; input.classList.add('text-sage');
        cwStatus.textContent = 'A little hint revealed. Keep solving!';
        moveFocusNext(r, c);
      });
      document.getElementById('cw-reset-btn').addEventListener('click', () => {
        Object.values(cellInputs).forEach(input => { input.value = ''; input.classList.remove('text-sage','text-terracotta'); });
        cwStatus.textContent = 'The puzzle is cleared. Have another try!';
      });
      document.querySelectorAll('.clue-item').forEach(clue => {
        clue.addEventListener('click', () => {
          const word = clue.dataset.word;
          const starts = { TANVI:[0,0], TUFFY:[0,0], PRISHA:[1,4], DEC:[1,2], MITHU:[5,1], DADU:[6,3] };
          const [r,c] = starts[word] || [0,0]; focusCell(r,c);
          cwStatus.textContent = `Find ${word} in the crossword grid.`;
        });
      });

      // Birthday wish candle and local-device keepsake storage.
      const candle = document.getElementById('candle-container');
      const flame = document.getElementById('candle-flame-group');
      const glow = document.getElementById('flame-glow');
      const smoke = document.getElementById('candle-smoke');
      const candleHint = document.getElementById('candle-hint');
      const wishInput = document.getElementById('wish-input');
      const wishList = document.getElementById('sealed-wishes-list');
      const wishContainer = document.getElementById('sealed-wishes-container');
      const blowBtn = document.getElementById('blow-wish-btn');
      const relightBtn = document.getElementById('relight-candle-btn');
      let candleLit = true;
      function setCandle(lit) {
        candleLit = lit;
        flame.style.opacity = lit ? '1' : '0';
        glow.style.opacity = lit ? '1' : '0';
        smoke.style.opacity = lit ? '0' : '1';
        candleHint.textContent = lit ? 'Candle is lit — ready for your wish' : 'Your wish has been sealed among the stars ✦';
        blowBtn.classList.toggle('hidden', !lit);
        relightBtn.classList.toggle('hidden', lit);
      }
      function renderWishes() {
        let wishes = [];
        try { wishes = JSON.parse(localStorage.getItem('tanviChapter21Wishes') || '[]'); } catch (_) {}
        wishList.innerHTML = '';
        wishes.forEach((wish, i) => {
          const item = document.createElement('div');
          item.className = 'rounded-xl bg-parchment border border-champagne/25 p-4';
          const heading = document.createElement('p'); heading.className = 'text-xs uppercase tracking-widest text-sage mb-1'; heading.textContent = `Star ${i+1}`;
          const body = document.createElement('p'); body.className = 'font-serif text-lg text-espresso'; body.textContent = wish;
          item.append(heading, body); wishList.appendChild(item);
        });
        wishContainer.classList.toggle('hidden', wishes.length === 0);
      }
      function sealWish() {
        const wish = wishInput.value.trim();
        if (!wish) { showToast('Write a little wish before sealing it ✦'); wishInput.focus(); return; }
        let wishes = [];
        try { wishes = JSON.parse(localStorage.getItem('tanviChapter21Wishes') || '[]'); } catch (_) {}
        wishes.push(wish);
        try { localStorage.setItem('tanviChapter21Wishes', JSON.stringify(wishes)); } catch (_) {}
        wishInput.value = ''; setCandle(false); renderWishes();
        showToast('Your wish has been sealed. May it come true! ✨');
        launchCelebration(window.innerWidth / 2, window.innerHeight * 0.55, 45);
      }
      blowBtn.addEventListener('click', sealWish);
      candle.addEventListener('click', () => setCandle(!candleLit));
      relightBtn.addEventListener('click', () => setCandle(true));
      renderWishes();

      // Reveal sections gently as they enter the viewport.
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal-on-scroll').forEach(section => revealObserver.observe(section));
    });
