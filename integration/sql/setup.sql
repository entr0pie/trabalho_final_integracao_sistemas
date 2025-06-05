DELETE FROM message 
USING "user" 
WHERE message.user_id_send = "user".user_id 
   OR message.user_id_receive = "user".user_id
   AND "user".email IN ('kauan@alexandre.com', 'joao@fuleco.com', 'vinicius@rebelatto.com');

DELETE FROM "user" WHERE email IN ('kauan@alexandre.com', 'joao@fuleco.com', 'vinicius@rebelatto.com');

INSERT INTO "user" (user_id, name, last_name, email, password) VALUES 
(2345678, 'João', 'Fuleco', 'joao@fuleco.com', 'teste123'),
(2345679, 'Vinicius', 'Rebelatto', 'vinicius@rebelatto.com', 'teste123');
