-- ============================================================================
-- Seed data — calm, professional starter content in kk / ru / en
-- Idempotent: uses unique keys (slug / key / path) and ON CONFLICT.
-- ============================================================================

-- ---------- site_settings (single row) --------------------------------------
insert into public.site_settings (
  site_name, default_locale,
  seo_title_kk, seo_title_ru, seo_title_en,
  seo_description_kk, seo_description_ru, seo_description_en
) values (
  'Сенім', 'kk',
  'Сенім — балалар мен жасөспірімдерге арналған түзету-дамыту орталығы',
  'Сенім — коррекционно-развивающий центр для детей и подростков в Шымкенте',
  'Senim — developmental support centre for children and teenagers in Shymkent',
  'Сөйлеу, қарым-қатынас, зейін, қозғалыс және өзіндік дағдыларды дамытамыз. Шымкент.',
  'Помогаем детям развивать речь, коммуникацию, внимание, движение и самостоятельность. Шымкент.',
  'We help children grow their speech, communication, attention, movement and independence. Shymkent.'
)
on conflict do nothing;

-- ---------- contacts (single row) -------------------------------------------
insert into public.contacts (
  phone, whatsapp, email, instagram,
  address_kk, address_ru, address_en,
  working_hours, map_iframe
) values (
  '+7 700 000 00 00',
  '+7 700 000 00 00',
  'hello@senim.kz',
  'senim_damytu_ortalygy',
  'Шымкент қ., Бейбітшілік к-сі, 14/1',
  'г. Шымкент, ул. Бейбитшилик, 14/1',
  'Shymkent, Beybitshilik str. 14/1',
  jsonb_build_object(
    'mon_fri_kk', 'Дс–Жм 09:00–19:00',
    'mon_fri_ru', 'Пн–Пт 09:00–19:00',
    'mon_fri_en', 'Mon–Fri 09:00–19:00',
    'sat_kk',     'Сб 10:00–16:00',
    'sat_ru',     'Сб 10:00–16:00',
    'sat_en',     'Sat 10:00–16:00',
    'sun_kk',     'Жс — демалыс',
    'sun_ru',     'Вс — выходной',
    'sun_en',     'Sun — closed'
  ),
  '<iframe src="https://2gis.kz/shymkent" width="100%" height="400" frameborder="0"></iframe>'
)
on conflict do nothing;

-- ---------- homepage_sections -----------------------------------------------
insert into public.homepage_sections
  (key, title_kk, title_ru, title_en, subtitle_kk, subtitle_ru, subtitle_en, sort_order)
values
  ('hero',
    'Сенім — балалар мен жасөспірімдерге арналған түзету-дамыту орталығы',
    'Сенім — коррекционно-развивающий центр для детей и подростков',
    'Senim — a developmental support centre for children and teenagers',
    'Сөйлеу, қарым-қатынас, зейін, қозғалыс және өзіндік дағдыларды тыныш әрі қолдау көрсететін ортада дамытамыз.',
    'Помогаем развивать речь, коммуникацию, внимание, движение и самостоятельность в спокойной и поддерживающей среде.',
    'We help children grow speech, communication, attention, movement and independence in a calm, supportive environment.',
    10),
  ('audience',
    'Біз кімге көмектесеміз',
    'Кому мы помогаем',
    'Who we help',
    'Әр бала ерекше. Бағдарлама бастапқы консультация мен бақылаудан кейін жеке таңдалады.',
    'Каждый ребёнок уникален. Программу подбираем индивидуально после первичной консультации.',
    'Every child is unique. We design the programme after the initial consultation.',
    20),
  ('process',
    'Жұмыс қалай жүреді',
    'Как проходит работа',
    'How we work',
    null, null, null,
    30),
  ('trust',
    'Бізге неге сенеді',
    'Почему нам доверяют',
    'Why families trust us',
    null, null, null,
    40),
  ('consultation',
    'Бастапқы консультация',
    'Первичная консультация',
    'Initial consultation',
    'Бағдарлама мен құны бастапқы консультация мен бақылаудан кейін анықталады.',
    'Стоимость и программа определяются после первичной консультации и наблюдения.',
    'The programme and price are defined after the initial consultation.',
    50)
on conflict (key) do update set
  title_kk = excluded.title_kk,
  title_ru = excluded.title_ru,
  title_en = excluded.title_en,
  subtitle_kk = excluded.subtitle_kk,
  subtitle_ru = excluded.subtitle_ru,
  subtitle_en = excluded.subtitle_en,
  sort_order = excluded.sort_order;

-- ---------- services --------------------------------------------------------
insert into public.services
  (slug, title_kk, title_ru, title_en,
   short_description_kk, short_description_ru, short_description_en,
   suitable_for_kk, suitable_for_ru, suitable_for_en,
   skills_developed_kk, skills_developed_ru, skills_developed_en,
   how_it_works_kk, how_it_works_ru, how_it_works_en,
   price_note_kk, price_note_ru, price_note_en,
   icon, age_range, duration_minutes, sort_order)
values
  ('aba',
    'ABA-терапия', 'ABA-терапия', 'ABA therapy',
    'Мінез-құлық пен қарым-қатынас дағдыларын қолдайтын құрылымды бағдарлама.',
    'Структурированная программа для поддержки поведения и навыков общения.',
    'A structured programme that supports behaviour and communication skills.',
    'Ерте араласу қажет ететін балаларға, әлеуметтік дағдыларды дамытуға.',
    'Детям, которым требуется раннее структурированное сопровождение и развитие социальных навыков.',
    'Children who benefit from structured early support and social-skill development.',
    'Сұраныс жасау, кезек күту, нұсқауларды орындау, өзіндік дағдылар.',
    'Просьба, ожидание очереди, выполнение инструкций, бытовые навыки.',
    'Requesting, turn-taking, following instructions, daily-living skills.',
    'Жеке сабақтар, нақты мақсаттар, прогресс мониторингі, ата-анаға жаттығулар.',
    'Индивидуальные занятия, чёткие цели, мониторинг прогресса, упражнения для родителей.',
    'One-to-one sessions with clear goals, progress tracking and parent home practice.',
    'Окончательная стоимость и программа определяются после первичной консультации.',
    'Окончательная стоимость и программа определяются после первичной консультации.',
    'Final cost and programme are defined after the initial consultation.',
    'sparkles', '2–14', 45, 10),

  ('logoped',
    'Логопед', 'Логопед', 'Speech therapy',
    'Сөйлеу мен дыбыс шығаруды дамыту бойынша жеке сабақтар.',
    'Индивидуальные занятия по развитию речи и звукопроизношения.',
    'One-to-one sessions to grow speech and articulation.',
    'Сөйлеу кешеуілдеуі, дыбыс шығару қиындықтары бар балаларға.',
    'Детям с задержкой речи, трудностями звукопроизношения.',
    'Children with speech delay or articulation difficulties.',
    'Артикуляция, сөздік қор, грамматика, байланысты сөйлеу.',
    'Артикуляция, словарный запас, грамматика, связная речь.',
    'Articulation, vocabulary, grammar, connected speech.',
    'Жылы атмосферада ойын арқылы өтетін жеке сабақтар.',
    'Индивидуальные занятия в тёплой атмосфере через игру.',
    'One-to-one play-based sessions in a warm atmosphere.',
    null, null, null,
    'message-circle', '2–12', 45, 20),

  ('defektolog',
    'Дефектолог', 'Дефектолог', 'Special-needs educator',
    'Танымдық дағдылар мен оқуға дайындықты дамыту.',
    'Развитие познавательных навыков и подготовка к обучению.',
    'Development of cognitive skills and learning readiness.',
    'Танымдық дамуда қолдау қажет балаларға.',
    'Детям, которым нужна поддержка в познавательном развитии.',
    'Children who need cognitive-development support.',
    'Зейін, есте сақтау, ойлау, кеңістіктік ұсыныс.',
    'Внимание, память, мышление, пространственные представления.',
    'Attention, memory, thinking, spatial awareness.',
    null, null, null, null, null, null,
    'brain', '3–12', 45, 30),

  ('afk',
    'АФК', 'АФК — адаптивная физкультура', 'Adaptive physical education',
    'Қозғалыс пен үйлесімділікті дамытатын бейімделген сабақтар.',
    'Адаптированные занятия по развитию движения и координации.',
    'Adapted sessions for movement and coordination development.',
    'Жалпы және ұсақ моторика бойынша қолдау қажет балаларға.',
    'Детям, которым нужна поддержка крупной и мелкой моторики.',
    'Children who need gross- and fine-motor support.',
    'Тепе-теңдік, үйлесімділік, бұлшықет тонусы, дене сұлбасы.',
    'Баланс, координация, мышечный тонус, схема тела.',
    'Balance, coordination, muscle tone, body awareness.',
    null, null, null, null, null, null,
    'activity', '2–14', 45, 40),

  ('sensory',
    'Сенсорлық интеграция', 'Сенсорная интеграция', 'Sensory integration',
    'Сенсорлық тәжірибені реттеуге бағытталған сабақтар.',
    'Занятия, направленные на регуляцию сенсорного опыта.',
    'Sessions focused on regulating sensory experience.',
    'Сенсорлық сезімталдығы немесе сезім өңдеу қиындықтары бар балаларға.',
    'Детям с сенсорной чувствительностью и трудностями обработки сенсорной информации.',
    'Children with sensory sensitivity or sensory-processing challenges.',
    'Тыныштық, өзін-өзі реттеу, тактильді/вестибулярлы тұрақтылық.',
    'Спокойствие, саморегуляция, тактильная и вестибулярная устойчивость.',
    'Calmness, self-regulation, tactile and vestibular tolerance.',
    null, null, null, null, null, null,
    'waves', '2–10', 45, 50),

  ('logomassage',
    'Логомассаж', 'Логомассаж', 'Speech massage',
    'Сөйлеу аппаратын жұмсақ дайындау.',
    'Мягкая подготовка артикуляционного аппарата.',
    'Gentle preparation of the articulatory apparatus.',
    null, null, null, null, null, null, null, null, null, null, null, null,
    'hand-helping', '2–10', 30, 60),

  ('neuropsy',
    'Нейропсихолог', 'Нейропсихолог', 'Neuropsychologist',
    'Жоғары психикалық функцияларды диагностикалау және дамыту.',
    'Диагностика и развитие высших психических функций.',
    'Assessment and development of higher mental functions.',
    null, null, null, null, null, null, null, null, null, null, null, null,
    'brain', '4–14', 50, 70),

  ('psychologist',
    'Психолог', 'Психолог', 'Psychologist',
    'Эмоциялық саланы қолдау, ата-анамен жұмыс.',
    'Поддержка эмоциональной сферы, работа с родителями.',
    'Emotional support and parent guidance.',
    null, null, null, null, null, null, null, null, null, null, null, null,
    'heart', '3–17', 50, 80),

  ('school-prep',
    'Мектепке дайындық', 'Подготовка к школе', 'School readiness',
    'Жұмсақ кіру арқылы оқу дағдыларын қалыптастыру.',
    'Формирование учебных навыков через мягкое включение.',
    'Building learning skills through gentle scaffolding.',
    null, null, null, null, null, null, null, null, null, null, null, null,
    'graduation-cap', '5–7', 50, 90),

  ('individual-program',
    'Жеке коррекциялық бағдарлама', 'Индивидуальная коррекционная программа', 'Individual programme',
    'Бірнеше маманның қолдауын біріктіретін жеке бағдарлама.',
    'Индивидуальная программа, объединяющая поддержку нескольких специалистов.',
    'Individual programme that combines support from several specialists.',
    null, null, null, null, null, null, null, null, null, null, null, null,
    'layers', null, null, 100),

  ('group-classes',
    'Топтық сабақтар', 'Групповые занятия', 'Small-group sessions',
    'Шағын топтарда әлеуметтік өзара әрекеттесу дағдыларын дамыту.',
    'Развитие социальных навыков в малых группах.',
    'Building social skills in small groups.',
    null, null, null, null, null, null, null, null, null, null, null, null,
    'users', '4–12', 60, 110)
on conflict (slug) do nothing;

-- ---------- specialists -----------------------------------------------------
insert into public.specialists
  (full_name_kk, full_name_ru, full_name_en,
   position_kk, position_ru, position_en,
   bio_kk, bio_ru, bio_en,
   experience_years, directions, is_published, sort_order)
values
  ('Айгүл Серікқызы', 'Айгуль Сериковна', 'Aigul Serikovna',
    'Логопед-дефектолог', 'Логопед-дефектолог', 'Speech & special-needs educator',
    'Балалар сөйлеуін дамыту бойынша 8 жыл тәжірибе.',
    'Опыт работы с детской речью более 8 лет.',
    'Over 8 years of experience with children''s speech.',
    8, array['Логопед','Дефектолог'], true, 10),
  ('Дамир Қайратұлы', 'Дамир Кайратович', 'Damir Kairatovich',
    'ABA-терапевт', 'ABA-терапевт', 'ABA therapist',
    'Құрылымды бағдарламалар бойынша сертификатталған маман.',
    'Сертифицированный специалист по структурированным программам.',
    'Certified specialist in structured programmes.',
    5, array['ABA','Поведение'], true, 20),
  ('Гүлназ Мұратқызы', 'Гульназ Муратовна', 'Gulnaz Muratovna',
    'Нейропсихолог', 'Нейропсихолог', 'Neuropsychologist',
    'Жоғары психикалық функциялар бойынша диагностика және сабақтар.',
    'Диагностика и занятия по высшим психическим функциям.',
    'Assessment and sessions on higher mental functions.',
    6, array['Нейропсихолог'], true, 30)
on conflict do nothing;

-- ---------- reviews ---------------------------------------------------------
insert into public.reviews
  (parent_name, rating, text_kk, text_ru, text_en, language, is_featured, reviewed_at)
values
  ('Айнұр',     5,
    'Балам алғашқы айдан кейін көбірек сөйлей бастады. Маманға және орталыққа алғыс білдіреміз.',
    'Сын начал больше говорить уже после первого месяца. Спасибо специалисту и центру.',
    'Our son started speaking more after the first month. Thank you to the specialist and the centre.',
    'ru', true, current_date - 30),
  ('Айдана',    5, null,
    'Очень тёплая атмосфера, ребёнок идёт на занятия с радостью.',
    'Very warm atmosphere — our child happily goes to the sessions.',
    'ru', true, current_date - 45),
  ('Нұрлан',    5, null,
    'Спокойный, бережный подход. Видим прогресс в коммуникации.',
    'Calm, caring approach. We can see progress in communication.',
    'ru', false, current_date - 60)
on conflict do nothing;

-- ---------- faqs ------------------------------------------------------------
insert into public.faqs
  (question_kk, question_ru, question_en, answer_kk, answer_ru, answer_en, sort_order)
values
  ('Бастапқы консультация қанша уақытқа созылады?',
    'Сколько длится первичная консультация?',
    'How long does the initial consultation take?',
    'Әдетте 45–60 минут. Біз баланы танып, ата-анамен сөйлесіп, мақсаттарды талқылаймыз.',
    'Обычно 45–60 минут. Мы знакомимся с ребёнком, общаемся с родителями и обсуждаем цели.',
    'Typically 45–60 minutes. We meet the child, talk with parents and agree on goals.',
    10),
  ('Қандай құжаттарды алу керек?',
    'Какие документы нужно взять с собой?',
    'What documents should I bring?',
    'Бар болса, бұрынғы маман қорытындылары мен медициналық анықтамаларды алыңыз.',
    'Если есть, возьмите заключения предыдущих специалистов и медицинские справки.',
    'If available, bring previous specialist reports and medical notes.',
    20),
  ('Бағдарламаны кім жасайды?',
    'Кто составляет программу занятий?',
    'Who designs the programme?',
    'Бағдарлама бастапқы консультациядан кейін бейіндік маманмен бірге жасалады.',
    'Программа составляется профильным специалистом после первичной консультации.',
    'A specialist designs the programme after the initial consultation.',
    30),
  ('Сабақтар қалай өтеді?',
    'Как проходят занятия?',
    'How are sessions organised?',
    'Жайбарақат ортада, жеке немесе шағын топта, нақты мақсаттармен.',
    'В спокойной среде, индивидуально или в малой группе, с понятными целями.',
    'In a calm environment, one-to-one or in small groups, with clear goals.',
    40)
on conflict do nothing;

-- ---------- blog_posts (ready-to-edit drafts, published) --------------------
insert into public.blog_posts
  (slug, title_kk, title_ru, title_en,
   excerpt_kk, excerpt_ru, excerpt_en,
   body_kk, body_ru, body_en,
   is_published, published_at)
values
  ('how-to-prepare-for-first-visit',
    'Алғашқы келуге қалай дайындалу керек',
    'Как подготовиться к первому визиту',
    'How to prepare for the first visit',
    'Бірнеше қарапайым қадам бала үшін бірінші келуді жайбарақат етеді.',
    'Несколько простых шагов помогут сделать первый визит спокойным для ребёнка.',
    'A few simple steps will make the first visit calm for the child.',
    'Балаға не болатынын алдын ала айтып беріңіз. Ұнамды зат алыңыз. Сергек уақытты таңдаңыз.',
    'Расскажите ребёнку, что его ждёт. Возьмите любимую игрушку. Выберите бодрое время дня.',
    'Tell the child what to expect. Bring a familiar item. Choose a time when they are well-rested.',
    true, now()),
  ('what-is-sensory-integration',
    'Сенсорлық интеграция дегеніміз не',
    'Что такое сенсорная интеграция',
    'What is sensory integration',
    'Сенсорлық ақпаратты өңдеу қалай жұмыс істейді және неге маңызды.',
    'Как работает обработка сенсорной информации и почему это важно.',
    'How sensory processing works and why it matters.',
    'Бұл — мида сенсорлық ақпаратты ұйымдастыру процесі. Ол назар, мінез-құлық пен дағдыларға әсер етеді.',
    'Это процесс организации сенсорной информации в мозге. Он влияет на внимание, поведение и навыки.',
    'It is the brain''s process of organising sensory input. It influences attention, behaviour and skills.',
    true, now() - interval '7 days')
on conflict (slug) do nothing;

-- ---------- pages_seo -------------------------------------------------------
insert into public.pages_seo (path, meta_title_kk, meta_title_ru, meta_title_en,
                              meta_description_kk, meta_description_ru, meta_description_en)
values
  ('/',
    'Сенім — түзету-дамыту орталығы',
    'Сенім — коррекционно-развивающий центр',
    'Senim — developmental support centre',
    'Шымкент қаласындағы балалар мен жасөспірімдерге арналған орталық.',
    'Центр для детей и подростков в Шымкенте.',
    'A centre for children and teenagers in Shymkent.'),
  ('/services',
    'Қызметтер — Сенім', 'Услуги — Сенім', 'Services — Senim',
    'Логопед, дефектолог, ABA, нейропсихолог, АФК, сенсорлық интеграция.',
    'Логопед, дефектолог, ABA, нейропсихолог, АФК, сенсорная интеграция.',
    'Speech, special-needs, ABA, neuropsychology, adaptive PE, sensory integration.'),
  ('/contacts',
    'Байланыс — Сенім', 'Контакты — Сенім', 'Contacts — Senim',
    'Шымкент, Бейбітшілік 14/1.', 'Шымкент, Бейбитшилик 14/1.', 'Shymkent, Beybitshilik 14/1.')
on conflict (path) do nothing;
