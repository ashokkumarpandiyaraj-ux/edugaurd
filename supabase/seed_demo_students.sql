-- Optional synthetic seed only. Safe to re-run: external_student_id is unique.
insert into public.students (external_student_id, course, module, education_level, hours_studied, attendance, previous_scores, risk_level, risk_probability)
values
('STU-1001','Mathematics','MTH-101','A-Level',9,91,82,'LOW',.18),('STU-1002','Computer Science','CSC-102','HE Qualification',10,95,76,'LOW',.21),
('STU-1003','Physics','PHY-112','Other',7,65,68,'MEDIUM',.54),('STU-1004','Biology','BIO-110','A-Level',9,88,74,'LOW',.14),
('STU-1005','Mathematics','MTH-101','HE Qualification',6,58,61,'HIGH',.72),('STU-1006','Statistics','STA-204','Other',7,72,64,'MEDIUM',.49),
('STU-1007','Computer Science','CSC-102','A-Level',9,91,79,'LOW',.16),('STU-1008','Physics','PHY-112','HE Qualification',8,84,71,'LOW',.12),
('STU-1009','Biology','BIO-110','Other',7,69,59,'MEDIUM',.46),('STU-1010','Statistics','STA-204','A-Level',6,55,58,'HIGH',.69),
('STU-1011','Mathematics','MTH-101','HE Qualification',9,93,85,'LOW',.22),('STU-1012','Computer Science','CSC-102','Other',7,66,63,'MEDIUM',.52),
('STU-1013','Physics','PHY-112','A-Level',9,89,81,'LOW',.15),('STU-1014','Statistics','STA-204','HE Qualification',6,61,57,'MEDIUM',.43),
('STU-1015','Biology','BIO-110','Other',9,91,78,'LOW',.19),('STU-1016','Mathematics','MTH-101','A-Level',5,54,56,'HIGH',.75),
('STU-1017','Computer Science','CSC-102','HE Qualification',8,82,69,'LOW',.09),('STU-1018','Physics','PHY-112','Other',7,65,60,'MEDIUM',.41),
('STU-1019','Statistics','STA-204','A-Level',9,90,76,'LOW',.14),('STU-1020','Biology','BIO-110','HE Qualification',9,87,72,'LOW',.17),
('STU-1023','Mathematics','MTH-101','Other',6,62,62,'HIGH',.78),('STU-1045','Computer Science','CSC-102','A-Level',7,66,64,'HIGH',.74),
('STU-1088','Physics','PHY-112','HE Qualification',7,69,66,'MEDIUM',.61),('STU-1102','Statistics','STA-204','Other',7,72,71,'MEDIUM',.57)
on conflict (external_student_id) do update set course = excluded.course, module = excluded.module, education_level = excluded.education_level, hours_studied = excluded.hours_studied, attendance = excluded.attendance, previous_scores = excluded.previous_scores, risk_level = excluded.risk_level, risk_probability = excluded.risk_probability;
