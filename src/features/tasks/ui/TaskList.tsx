import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../model/useTasks';
import styles from './TaskList.module.css';

export const TaskList = () => {
  const { t } = useTranslation();
  const inputId = useId();

  const { tasks, stats, addTask, toggleTask, deleteTask } = useTasks();
  const [text, setText] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const added = addTask(text);
    if (added) setText('');
  };

  return (
    <div className={styles.tasks}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('tasks.title')}</h3>
        <div className={styles.meta}>
          {t('tasks.meta', { completed: stats.completed, total: stats.total })}
        </div>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <input
          id={inputId}
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('tasks.placeholder')}
          aria-label={t('tasks.inputAria')}
        />
        <button
          className={styles.addButton}
          type="submit"
          disabled={!text.trim()}
        >
          {t('tasks.add')}
        </button>
      </form>

      {tasks.length > 0 ? (
        <div className={styles.list} role="list">
          {tasks.map((task) => (
            <div key={task.id} className={styles.item} role="listitem">
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={t('tasks.toggleAria', { text: task.text })}
              />
              <div
                className={`${styles.text} ${
                  task.completed ? styles.textCompleted : ''
                }`}
              >
                {task.text}
              </div>
              <button
                className={styles.deleteButton}
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={t('tasks.deleteAria', { text: task.text })}
                title={t('tasks.delete')}
              >
                {t('tasks.delete')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{t('tasks.empty')}</p>
        </div>
      )}
    </div>
  );
};
