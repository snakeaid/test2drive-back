-- Test2Drive Database Seed Script
-- Run this script to populate the database with test data for development and testing
-- Password for all test users: "password123" (hashed with bcrypt)

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Insert test users
INSERT INTO users (id, email, password_hash, first_name, last_name, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@test2drive.ua', '$2b$10$rQ8K3Zj9mG5qY7wE2xL4C.vN6sB8dF1hJ3kM9nP2rT5uW8xZ4aB6c', 'Адміністратор', 'Системи', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'student1@test.ua', '$2b$10$rQ8K3Zj9mG5qY7wE2xL4C.vN6sB8dF1hJ3kM9nP2rT5uW8xZ4aB6c', 'Олександр', 'Петренко', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'student2@test.ua', '$2b$10$rQ8K3Zj9mG5qY7wE2xL4C.vN6sB8dF1hJ3kM9nP2rT5uW8xZ4aB6c', 'Марія', 'Іваненко', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'instructor@test.ua', '$2b$10$rQ8K3Zj9mG5qY7wE2xL4C.vN6sB8dF1hJ3kM9nP2rT5uW8xZ4aB6c', 'Василь', 'Коваленко', NOW(), NOW());

-- Insert user profiles
INSERT INTO user_profiles (id, user_id, phone, date_of_birth, avatar_url, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+380671234567', '1985-03-15', NULL, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '+380501234567', '1998-07-22', NULL, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '+380931234567', '2000-12-05', NULL, NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '+380441234567', '1975-09-30', NULL, NOW(), NOW());

-- =====================================================
-- LECTURE SYSTEM
-- =====================================================

-- Insert lecture categories
INSERT INTO lecture_categories (id, name, description, sort_order, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Дорожні знаки', 'Вивчення всіх типів дорожніх знаків України', 1, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', 'Правила дорожнього руху', 'Основні правила та норми дорожнього руху', 2, NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440003', 'Безпека дорожнього руху', 'Заходи безпеки та попередження ДТП', 3, NOW(), NOW());

-- Insert lectures
INSERT INTO lectures (id, title, content, category_id, sort_order, is_published, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Попереджувальні знаки', 
'<h2>Попереджувальні дорожні знаки</h2>
<p>Попереджувальні знаки інформують водіїв про небезпечні ділянки дороги та характер небезпеки.</p>
<h3>Основні характеристики:</h3>
<ul>
<li>Форма: трикутна</li>
<li>Колір: білий фон, червона облямівка, чорний символ</li>
<li>Встановлюються за 150-300 м до небезпечної ділянки</li>
</ul>
<h3>Приклади знаків:</h3>
<p><strong>1.1 "Небезпечний поворот праворуч"</strong> - попереджає про крутий поворот дороги.</p>
<p><strong>1.11 "Нерівна дорога"</strong> - попереджає про ділянку дороги з нерівностями.</p>', 
'750e8400-e29b-41d4-a716-446655440001', 1, true, NOW(), NOW()),

('850e8400-e29b-41d4-a716-446655440002', 'Заборонні знаки', 
'<h2>Заборонні дорожні знаки</h2>
<p>Заборонні знаки вводять або скасовують певні обмеження руху.</p>
<h3>Основні характеристики:</h3>
<ul>
<li>Форма: кругла</li>
<li>Колір: білий фон, червона облямівка</li>
<li>Дія: від місця встановлення до найближчого перехрестя</li>
</ul>
<h3>Найважливіші знаки:</h3>
<p><strong>3.1 "В''їзд заборонено"</strong> - забороняє рух усіх транспортних засобів.</p>
<p><strong>3.2 "Рух механічних транспортних засобів заборонено"</strong> - не поширюється на мопеди.</p>', 
'750e8400-e29b-41d4-a716-446655440001', 2, true, NOW(), NOW()),

('850e8400-e29b-41d4-a716-446655440003', 'Швидкісний режим', 
'<h2>Обмеження швидкості в Україні</h2>
<p>Дотримання швидкісного режиму - основа безпечного руху.</p>
<h3>Загальні обмеження швидкості:</h3>
<ul>
<li><strong>У населених пунктах:</strong> 50 км/год</li>
<li><strong>Поза населеними пунктами:</strong> 90 км/год</li>
<li><strong>На автомагістралях:</strong> 130 км/год</li>
<li><strong>У житлових зонах:</strong> 20 км/год</li>
</ul>
<h3>Додаткові обмеження:</h3>
<p>Для водіїв зі стажем менше 2 років швидкість обмежена 70 км/год поза населеними пунктами.</p>', 
'750e8400-e29b-41d4-a716-446655440002', 1, true, NOW(), NOW());

-- =====================================================
-- QUESTION SYSTEM
-- =====================================================

-- Insert question categories (linking to lecture categories)
INSERT INTO question_categories (id, name, description, lecture_category_id, sort_order, created_at, updated_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'Дорожні знаки', 'Питання про дорожні знаки та їх значення', '750e8400-e29b-41d4-a716-446655440001', 1, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440002', 'ПДР', 'Питання з правил дорожнього руху', '750e8400-e29b-41d4-a716-446655440002', 2, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440003', 'Безпека руху', 'Питання з безпеки дорожнього руху', '750e8400-e29b-41d4-a716-446655440003', 3, NOW(), NOW());

-- Insert questions
INSERT INTO questions (id, question_text, question_image_url, explanation, difficulty, category_id, is_published, created_at, updated_at) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 
'Що означає дорожній знак у формі червоного кола з білою горизонтальною смугою всередині?',
NULL,
'Знак 3.1 "В''їзд заборонено" забороняє рух усіх транспортних засобів у даному напрямку.',
'easy',
'950e8400-e29b-41d4-a716-446655440001',
true, NOW(), NOW()),

('a50e8400-e29b-41d4-a716-446655440002',
'Яка максимальна швидкість руху легкового автомобіля в населеному пункті?',
NULL,
'У населених пунктах максимальна швидкість для легкових автомобілів становить 50 км/год.',
'easy',
'950e8400-e29b-41d4-a716-446655440002',
true, NOW(), NOW()),

('a50e8400-e29b-41d4-a716-446655440003',
'На якій відстані від пішохідного переходу заборонено зупинку транспортних засобів?',
NULL,
'Зупинка заборонена ближче ніж за 5 метрів перед пішохідним переходом та ближче ніж за 10 метрів після нього.',
'medium',
'950e8400-e29b-41d4-a716-446655440002',
true, NOW(), NOW()),

('a50e8400-e29b-41d4-a716-446655440004',
'Що повинен зробити водій при наближенні до регульованого перехрестя на жовтий сигнал світлофора?',
NULL,
'При жовтому сигналі світлофора водій повинен зупинитися, якщо це можливо зробити безпечно. Продовжувати рух дозволено лише тим, хто не може зупинитися безпечно.',
'hard',
'950e8400-e29b-41d4-a716-446655440002',
true, NOW(), NOW());

-- Insert question options
INSERT INTO question_options (id, question_id, option_letter, option_text, is_correct, created_at, updated_at) VALUES
-- Question 1 options
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'A', 'В''їзд заборонено', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'B', 'Стоянка заборонена', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', 'C', 'Рух прямо', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440001', 'D', 'Обгін заборонено', false, NOW(), NOW()),

-- Question 2 options
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440002', 'A', '40 км/год', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440002', 'B', '50 км/год', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440002', 'C', '60 км/год', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440002', 'D', '70 км/год', false, NOW(), NOW()),

-- Question 3 options
('b50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440003', 'A', '3 метри', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440003', 'B', '5 метрів перед та 10 метрів після', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440003', 'C', '10 метрів', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440003', 'D', '15 метрів', false, NOW(), NOW()),

-- Question 4 options
('b50e8400-e29b-41d4-a716-446655440013', 'a50e8400-e29b-41d4-a716-446655440004', 'A', 'Зупинитися в будь-якому випадку', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440014', 'a50e8400-e29b-41d4-a716-446655440004', 'B', 'Прискорити проїзд', false, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440015', 'a50e8400-e29b-41d4-a716-446655440004', 'C', 'Зупинитися, якщо це можна зробити безпечно', true, NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440016', 'a50e8400-e29b-41d4-a716-446655440004', 'D', 'Ігнорувати сигнал', false, NOW(), NOW());

-- =====================================================
-- TEST SYSTEM
-- =====================================================

-- Insert practice tests
INSERT INTO tests (id, title, description, type, time_limit_minutes, passing_score_percentage, questions_count, category_id, is_published, allow_retries, show_results_immediately, sort_order, created_at, updated_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 
'Тренувальний тест - Дорожні знаки', 
'Практичний тест для вивчення дорожніх знаків', 
'practice', 
10, 
70, 
2, 
'950e8400-e29b-41d4-a716-446655440001', 
true, true, true, 1, NOW(), NOW()),

('c50e8400-e29b-41d4-a716-446655440002', 
'Тематичний тест - ПДР', 
'Тематичний тест з правил дорожнього руху', 
'thematic', 
15, 
75, 
2, 
'950e8400-e29b-41d4-a716-446655440002', 
true, true, true, 1, NOW(), NOW()),

-- Insert exam
('c50e8400-e29b-41d4-a716-446655440003', 
'Офіційний іспит ПДР категорії B', 
'Офіційний екзамен для отримання посвідчення водія категорії B', 
'exam', 
20, 
75, 
4, 
NULL, 
true, false, false, 1, NOW(), NOW());

-- Insert test questions (linking tests to questions)
INSERT INTO test_questions (id, test_id, question_id, question_order, points, created_at, updated_at) VALUES
-- Practice test - Road signs
('d50e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 1, 1, NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440002', 2, 1, NOW(), NOW()),

-- Thematic test - Traffic rules
('d50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 1, 1, NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440004', 'c50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440003', 2, 1, NOW(), NOW()),

-- Official exam
('d50e8400-e29b-41d4-a716-446655440005', 'c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', 1, 1, NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440006', 'c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440002', 2, 1, NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440007', 'c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', 3, 1, NOW(), NOW()),
('d50e8400-e29b-41d4-a716-446655440008', 'c50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440004', 4, 1, NOW(), NOW());

-- =====================================================
-- SAMPLE PROGRESS DATA
-- =====================================================

-- Insert some lecture progress for student1
INSERT INTO lecture_progress (id, user_id, lecture_id, completed_at, created_at, updated_at) VALUES
('e50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('e50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert some question attempts for student1
INSERT INTO question_attempts (id, user_id, question_id, selected_option_id, attempt_number, is_correct, time_spent_seconds, created_at, updated_at) VALUES
('f50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 1, true, 15, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('f50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440005', 1, false, 25, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('f50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440006', 2, true, 18, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify the data was inserted correctly:

/*
-- Check users
SELECT u.email, u.first_name, u.last_name, up.phone FROM users u 
LEFT JOIN user_profiles up ON u.id = up.user_id;

-- Check lecture structure
SELECT lc.name as category, l.title, l.sort_order 
FROM lecture_categories lc 
LEFT JOIN lectures l ON lc.id = l.category_id 
ORDER BY lc.sort_order, l.sort_order;

-- Check question structure
SELECT qc.name as category, q.question_text, q.difficulty, COUNT(qo.id) as options_count
FROM question_categories qc
LEFT JOIN questions q ON qc.id = q.category_id
LEFT JOIN question_options qo ON q.id = qo.question_id
GROUP BY qc.name, q.question_text, q.difficulty
ORDER BY qc.sort_order;

-- Check test structure
SELECT t.title, t.type, t.questions_count, COUNT(tq.id) as actual_questions
FROM tests t
LEFT JOIN test_questions tq ON t.id = tq.test_id
GROUP BY t.title, t.type, t.questions_count
ORDER BY t.type, t.sort_order;
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Test2Drive database seeded successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '👥 Test Users Created:';
    RAISE NOTICE '   - admin@test2drive.ua (Admin)';
    RAISE NOTICE '   - student1@test.ua (Олександр Петренко)';
    RAISE NOTICE '   - student2@test.ua (Марія Іваненко)';
    RAISE NOTICE '   - instructor@test.ua (Василь Коваленко)';
    RAISE NOTICE '   - All passwords: "password123"';
    RAISE NOTICE '';
    RAISE NOTICE '📚 Content Created:';
    RAISE NOTICE '   - 3 lecture categories with lectures';
    RAISE NOTICE '   - 3 question categories with 4 questions';
    RAISE NOTICE '   - 1 practice test, 1 thematic test, 1 exam';
    RAISE NOTICE '   - Sample progress data for testing';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for testing! Visit: http://localhost:5001/api-docs';
    RAISE NOTICE '';
END $$; 