/*create data base*/
create database medic_dev

create table medic(
    medic_id INTEGER generated always as identity,
    name varchar(200) not null,
    pat_last_name varchar(200) not null,
    mat_last_name varchar(200) not null,
    dni char(8) not null,
    birthdate date not null,
    gender char(1) not null,
    description text not null,
    code_cmp char(8) not null,
    code_rne char(8) not null,
    password varchar(60),
    certificate boolean not null,
    signature boolean not null,
    specialty_id integer not null,
    status boolean not null,
    audit_date timestamp not null,
    user_account_id integer not null,
    user_register_id integer not null
);

ALTER TABLE medic
ALTER COLUMN password TYPE varchar(60);
alter table medic
  add constraint xpk_medic primary key (medic_id);

create table specialty(
specialty_id integer generated always as identity,
name_specialty varchar(200) not null,
status boolean not null,
audit_date timestamp not null,
user_account_id integer not null,
user_register_id integer not null
);

/*example*/
insert into specialty (name_specialty, status, audit_date, user_account_id, user_register_id)
VALUES ('especialidad 6', true, now()::timestamp, 1, 1)
alter table specialty 
  add constraint xpk_specialty primary key (specialty_id)

call sp_insert_medic ('jose', 'perez', 'gonzalez', '47158964', '2023-09-19', 'M', '', '45871542', '65987425', true, 1, 1, 1)

/*procedures*/
-- Active: 1690899055310@@192.168.1.5@5432@msf_medic_dev@public
DROP PROCEDURE sp_disable_medic;
CREATE OR REPLACE PROCEDURE public.sp_disable_medic(IN _medic_id integer, IN _status boolean, IN _user_account_id integer)
 LANGUAGE plpgsql
AS $procedure$
  begin
    update medic set status = _status,
    user_account_id = _user_account_id, audit_date = now()::timestamp
    where medic_id  = _medic_id;
  commit;
end;$procedure$

-- Active: 1690899055310@@192.168.1.5@5432@msf_medic_dev@public
DROP PROCEDURE sp_insert_medic;
CREATE OR REPLACE PROCEDURE public.sp_insert_medic(IN _name character varying, IN _pat_last_name character varying, IN _mat_last_name character varying, IN _dni character, IN _age integer, IN _birthdate date, IN _gender character, IN _description text, IN _code_cmp character, IN _code_rne character, IN _signature boolean, IN _speciality_id integer, IN _user_account_id integer, IN _user_register_id integer)
 LANGUAGE plpgsql
AS $procedure$
  begin
    insert into medic (
    name,
    pat_last_name,
    mat_last_name,
    dni,
    birthdate,
    gender,
    description,
    code_cmp,
    code_rne,
    signature,
    specialty_id,
    status,
    audit_date,
    user_account_id,
    user_register_id
    )
    values (_name, _pat_last_name, mat_last_name, _birthdate, _gender, _description, _code_cmp, _code_rne, _speciality_id, true, now()::timestamp, _user_account_id, _user_register_id);
  commit;
end;$procedure$

-- Active: 1690899055310@@192.168.1.5@5432@msf_medic_dev@public
DROP PROCEDURE sp_update_medic;
CREATE OR REPLACE PROCEDURE public.sp_update_medic(IN _name character varying, IN _pat_last_name character varying, IN _mat_last_name character varying, IN _dni character, IN _birthdate date, IN _gender character, IN _description text, IN _code_cmp character, IN _code_rne character, IN _signature boolean, IN _certificate boolean, IN _password character varying, IN _speciality_id integer, IN _user_account_id integer, IN _user_register_id integer, IN _medicid integer)
 LANGUAGE plpgsql
AS $procedure$
  begin
    update medic set 
    name = _name,
    pat_last_name= _pat_last_name,
    mat_last_name = _mat_last_name,
    dni = _dni,
    birthdate = _birthdate,
    gender = _gender,
    description = _description,
    code_cmp = _code_cmp,
    code_rne = _code_rne,
    password = _password,
    certificate = _certificate,
    signature = _signature,
    specialty_id = _speciality_id,
    audit_date = now()::timestamp,
    user_account_id = _user_account_id,
    user_register_id = _user_register_id
    where 
    medic_id = _medicid;
  commit;
end;$procedure$