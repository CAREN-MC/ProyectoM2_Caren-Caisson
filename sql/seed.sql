INSERT INTO authors (name, email, bio) VALUES
  ('Susana Cordisco', 'scord@gmail.com', 'escritora de poesias, cuentos y microficciones'),
  ('Maria Palomeque', 'mpalomeque@gmail.com', 'escritora de cuentos infantiles'),
  ('Jorge Pinto', 'jpinto@gmail.com', 'escritor de ciencia ficción');
  INSERT INTO authors (name, email, bio) VALUES
  ('Lucas Funes', 'lfunes@gmail.com', 'cronista y ensayista'),
  ('Erica Aguirre', 'eaguirre@gmail.com', 'novelista de misterio'),
  ('Valeria Lopez', 'vlopez@gmail.com', 'poeta y dramaturga'),
  ('Martín Diaz', 'mdiaz@gmail.com', 'escritor de crónicas de viaje');
  
 
INSERT INTO posts (title, content, author_id, published) VALUES
  ('Lluvia de marzo', 'Poema sobre las tardes de lluvia y los recuerdos que despiertan...', 1, true),
  ('El dragón que tenía miedo a la oscuridad', 'Cuento infantil sobre un pequeño dragón y su amigo luciérnaga...', 2, true),
  ('Microficción: el último tren', 'Un hombre espera un tren que nunca llega, hasta que...', 1, true),
  ('Colonia en Marte', 'Relato de ciencia ficción sobre la primera familia nacida en Marte...', 3, false),
  ('Cuentos para antes de dormir', 'Borrador de una colección de cuentos cortos para leer en voz alta...', 1, false);
 
 INSERT INTO posts (title, content, author_id, published) VALUES
('Crónica de una ciudad dormida', 'Recorrido nocturno por las calles vacías del centro...', 4, true),
('El ensayo de los domingos', 'Reflexiones sobre el tiempo libre y la lectura...', 4, false),
('La llave bajo la maceta', 'Un detective descubre que el culpable siempre estuvo en la casa...', 5, true),
('Capítulo uno: la tormenta', 'Primer capítulo de una novela de misterio ambientada en la costa...', 5, false),
('Escenas para una sola voz', 'Monólogo breve pensado para un teatro pequeño...', 6, true),
('Versos de otoño', 'Poemas cortos sobre las hojas, el viento y la luz de la tarde...', 6, true),
('Diario de ruta: el camino al sur', 'Notas de viaje sobre pueblos, rutas y paisajes patagónicos...', 7, true),
('Mapa de cafés', 'Una guía personal de cafés encontrados en distintas ciudades...', 2, true);