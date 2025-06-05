DELETE FROM message 
USING "user" 
WHERE message.user_id_send = "user".user_id 
   OR message.user_id_receive = "user".user_id
   AND "user".email IN ('kauan@alexandre.com', 'joao@fuleco.com', 'vinicius@rebelatto.com');

DELETE FROM "user" WHERE email IN ('kauan@alexandre.com', 'joao@fuleco.com', 'vinicius@rebelatto.com');
