document.querySelectorAll('.trust-grid, .feature-grid, .steps, .store-row, .testimonial-grid, .faq-list, .footer-grid').forEach((group) => {
    group.querySelectorAll(':scope > .reveal').forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
    });
  });

  const countFormatter = new Intl.NumberFormat('th-TH');
  const counters = document.querySelectorAll('.count-up');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setCounterFinal = (counter) => {
    const target = Number(counter.dataset.count);
    counter.textContent = `${countFormatter.format(target)}+`;
    counter.dataset.counted = 'true';
  };

  const animateCounter = (counter) => {
    if (counter.dataset.counted === 'true') return;
    const target = Number(counter.dataset.count);
    const duration = 1200;
    const startedAt = performance.now();
    counter.dataset.counted = 'true';

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${countFormatter.format(Math.round(target * eased))}+`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(setCounterFinal);
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.count-up').forEach(animateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    const trustSection = document.querySelector('#trust');
    if (trustSection) counterObserver.observe(trustSection);
    setTimeout(() => {
      if (trustSection && isInViewport(trustSection)) counters.forEach(animateCounter);
    }, 1500);
  }

  const callbackForm = document.querySelector('#callback-form');
  const callbackSuccess = document.querySelector('#callback-success');
  const callbackReset = document.querySelector('#callback-reset');

  const setFieldError = (field, message) => {
    const error = document.querySelector(`#${field.getAttribute('aria-describedby')}`);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  };

  const validateCallbackForm = (form) => {
    const fields = [...form.querySelectorAll('input[required]')];
    let firstInvalid = null;

    fields.forEach((field) => {
      const value = field.value.trim();
      let message = '';
      setFieldError(field, '');

      if (!value) {
        message = 'กรุณากรอกข้อมูลช่องนี้';
      } else if (field.type === 'email' && !field.checkValidity()) {
        message = 'กรุณากรอกอีเมลให้ถูกต้อง';
      } else if (field.name === 'phone') {
        const digits = value.replace(/[\s-]/g, '');
        if (!/^\d{9,10}$/.test(digits)) message = 'กรุณากรอกเบอร์โทร 9–10 หลัก';
      }

      if (message) {
        setFieldError(field, message);
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  const showCallbackSuccess = (form) => {
    form.hidden = true;
    callbackSuccess.hidden = false;
    callbackSuccess.focus?.();
  };

  if (callbackForm && callbackSuccess && callbackReset) {
    callbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (validateCallbackForm(callbackForm)) showCallbackSuccess(callbackForm);
    });

    callbackForm.querySelectorAll('input').forEach((field) => {
      field.addEventListener('input', () => setFieldError(field, ''));
    });

    callbackReset.addEventListener('click', () => {
      callbackForm.reset();
      callbackForm.querySelectorAll('input').forEach((field) => setFieldError(field, ''));
      callbackSuccess.hidden = true;
      callbackForm.hidden = false;
      callbackForm.querySelector('input')?.focus();
    });
  }

  const sections = document.querySelectorAll(
    'body > section, body > footer, #expo-content > section, #expo-content > footer'
  );
  const revealAll = () => {
    sections.forEach((section) => section.classList.add('section-in'));
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    const activateSection = (section) => {
      section.classList.add('section-in');
      section.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          activateSection(section);
          sectionObserver.unobserve(section);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));

    // Safety fallback for a visible section if an observer callback is delayed.
    setTimeout(() => {
      sections.forEach((section) => {
        if (!section.classList.contains('section-in') && isInViewport(section)) {
          activateSection(section);
          sectionObserver.unobserve(section);
        }
      });
    }, 1800);
  }
