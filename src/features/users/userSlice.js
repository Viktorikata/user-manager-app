
import {createSlice, createAsyncThunk } from '@reduxjs/toolkit'

function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`
};

// Получение пользователей с сервера
export const fetchUsers = createAsyncThunk(
    'users/fetchusers',
    async () => {
        const response = await fetch ('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error ('Ошибка при загрузке пользователей');                
            }
            return await response.json();         
    }
);

// Создание нового пользователя 
export const createUser = createAsyncThunk(
    'users/createUser', 
    async(newUser) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser),
    });

    if (!response.ok) {
            throw new Error ('Не удалось создать пользователя');
    }

    const data = await response.json();

    const id = makeId();
    const user = {...data, ...newUser, id};

    console.log('[createUser] created', user);
    return user;
    
    }
);

// Удаление пользователя
export const deleteUser = createAsyncThunk (
    'users/deleteUser',
    async (userId) => {
        const response = await fetch (`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok)  {
            throw new Error ("Не удалось удалить пользователя");
        }
        return userId;
    }
);
        
// Начальное состояние 
const initialState = {
    users: [],
    status: 'idle',
    error: null
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {        
        updateUser: (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        }
    },

    extraReducers: builder => {
        builder 
        .addCase (fetchUsers.pending, (state) => {
            state.status ="loading";            
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.status ="succeeded";
            state.users = action.payload;
        })
        .addCase (fetchUsers.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
        .addCase (createUser.fulfilled, (state, action) => {
            state.users.push(action.payload);
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            const id = action.meta.arg;
            state.users = state.users.filter(user => String(user.id) !== String(id));
        })
    }
});

export const {updateUser} = usersSlice.actions;
export default usersSlice.reducer;
