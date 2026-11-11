INSERT INTO authors (name, email, bio) VALUES
  ('Susana Cordisco', 'scord@gmail.com', 'escritora de poesias, cuentos y microficciones'),
  ('Maria Palomeque', 'mpalomeque@gmail.com', 'escritora de cuentos infantiles'),
  ('Jorge Pinto', 'jpinto@gmail.com', 'escritor de ciencia ficción');
 
INSERT INTO posts (title, content, author_id, published) VALUES
  ('Lluvia de marzo', 'Poema sobre las tardes de lluvia y los recuerdos que despiertan...', 1, true),
  ('El dragón que tenía miedo a la oscuridad', 'Cuento infantil sobre un pequeño dragón y su amigo luciérnaga...', 2, true),
  ('Microficción: el último tren', 'Un hombre espera un tren que nunca llega, hasta que...', 1, true),
  ('Colonia en Marte', 'Relato de ciencia ficción sobre la primera familia nacida en Marte...', 3, false),
  ('Cuentos para antes de dormir', 'Borrador de una colección de cuentos cortos para leer en voz alta...', 1, false);