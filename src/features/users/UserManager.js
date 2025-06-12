import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser, fetchUsers, createUser, deleteUser} from './userSlice';
import './userManager.css';
import {FaTrashAlt, FaEdit} from 'react-icons/fa';

// Компонент для упрадвения пользователями:
// позволяет загружать, добавлять, редактировать и удалять пользователей
function UserManager () {
    const dispatch = useDispatch();
    const users = useSelector ((state) => state.userState.users);
    const status = useSelector ((state) => state.userState.status);
    const error = useSelector ((state) => state.userState.error);

    const [name, setName] = useState('');
    const [editUser, setEditUser] = useState(null); 

    // Загружает пользователей при первом рендере 
    useEffect (()=> {
        dispatch(fetchUsers()); 
    }, [dispatch]);

    return (
        <div className='wrapper'>
            <h2>Пользователи</h2>
            
            {/* Отображаем статус загрузки */}
            {status === "loading" && <p>Загрузка данных...</p>}

            {/* Отображаем ошибку при загрузке */}
            {error && <p style={{color: "red"}}>Ошибка: {error}</p>}

            <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Введите имя'
            />

            {editUser ? (
                <>

                {/* Если редактируем пользователя - показываем кнопки "Сохранить" и "Отмена"*/}
                <button
                    onClick={() => {
                        dispatch(updateUser({id:editUser.id, name}));
                        setEditUser(null);
                        setName("");
                    }}
                    > Сохранить              
                </button>

                <button
                    onClick={() =>{
                        setEditUser(null);
                        setName("");
                    }}
                > Отмена
                </button>
                </>

            ) : (

                <button
                onClick={() => {
                    if(name.trim()) {
                        // Добавляем нового пользоваетля через API
                        dispatch(createUser({name}));
                        setName("");
                    }
                }}
                >Добавить
                </button>
            )}
            
            {/* Сообщение при пустом списке */}
            {users.length === 0 && status === "succeeded" && (
                <p>Пользователей пока нет. Добавьте кого-нибудь!</p>
            )}

            <ul>
                {users.map((user)=> (
                    <li key={user.id}>
                        {user.name}{""}
                        <div className="buttonsEdit">
                        <button onClick={()=> setEditUser(user)}><FaEdit /></button>
                        <button onClick={()=> dispatch (deleteUser(user.id))}><FaTrashAlt /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserManager;

