import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button, Input, List, message } from 'antd';
import { LockOutlined, LoginOutlined, LogoutOutlined, SendOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import vkConnect from '@vkontakte/vk-connect';
import './index.css';

const { Content } = Layout;

// Редюсер для сохранения ключей пользователя в store
interface KeysState {
  aesKey: string;
  iv: string;
}

const initialKeysState: KeysState = {
  aesKey: '',
  iv: '',
};

const keysSlice = createSlice({
  name: 'keys',
  initialState: initialKeysState,
  reducers: {
    setKeys: (state, action: PayloadAction<KeysState>) => {
      state.aesKey = action.payload.aesKey;
      state.iv = action.payload.iv;
    },
  },
});

// Редюсер для сохранения сообщений в store
interface MessagesState {
  messages: string[];
}

const initialMessagesState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
  },
});

// Создание store с двумя редюсерами
const store = configureStore({
  reducer: {
    keys: keysSlice.reducer,
    messages: messagesSlice.reducer,
  },
});

// Action creators для редюсеров
const { setKeys } = keysSlice.actions;
const { addMessage } = messagesSlice.actions;

// Функция шифрования сообщения с помощью ключа AES
function encryptMessage(message: string, aesKey: string, iv: string) {
  const ciphertext = CryptoJS.AES.encrypt(message, aesKey, { iv }).toString();
  return ciphertext;
}

// Функция дешифрования сообщения с помощью ключа AES
function decryptMessage(ciphertext: string, aesKey: string, iv: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, aesKey, { iv });
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

// Компонент для ввода ключей пользователя
function KeyInput() {
  const dispatch = useDispatch();

  const [aesKey, setAesKey] = useState('');
  const [iv, setIv] = useState('');

  const handleSubmit = () => {
    dispatch(setKeys({ aesKey, iv }));
    setAesKey('');
    setIv('');
    message.success('Ключи сохранены!');
  };

  return (
    <div>
      <h3>Введите ключи:</h3>
      <Input
        placeholder="AES ключ"
        value={aesKey}
        onChange={(e) => setAesKey(e.target.value)}
        style={{ marginBottom: '16px' }}
        prefix={<LockOutlined />}
      />
      <Input
        placeholder="IV"
        value={iv}
        onChange={(e) => setIv(e.target.value)}
        style={{ marginBottom: '16px' }}
        prefix={<LockOutlined />}
