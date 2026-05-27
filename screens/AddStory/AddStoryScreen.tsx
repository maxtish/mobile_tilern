import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { addHistory } from '../../api/addHistory';
import { submitGPTHistory } from '../../api/submitGPTHistory';
import {
  getHistoryJobStatus,
  getMyHistoryJobs,
} from '../../api/getHistoryJobStatus';
import { useAppTheme } from '../../theme/ThemeProvider';
import {
  HistoryJob,
  HistoryJobStatus,
  HistoryJobStepStatus,
  useHistoryJobsStore,
} from '../../state/historyJobsStore';

type AddStoryScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'AddStory'
>;

const { height } = Dimensions.get('window');

export default function AddStoryScreen() {
  const navigation = useNavigation<AddStoryScreenNavigationProp>();
  const { appTheme } = useAppTheme();

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const jobs = useHistoryJobsStore(state => state.jobs);
  const statusExpanded = useHistoryJobsStore(state => state.statusExpanded);
  const setStatusExpanded = useHistoryJobsStore(
    state => state.setStatusExpanded,
  );
  const toggleStatusExpanded = useHistoryJobsStore(
    state => state.toggleStatusExpanded,
  );
  const upsertJob = useHistoryJobsStore(state => state.upsertJob);
  const setJobs = useHistoryJobsStore(state => state.setJobs);
  const clearFinishedJobs = useHistoryJobsStore(
    state => state.clearFinishedJobs,
  );

  const activeJobs = useMemo(
    () =>
      jobs.filter(
        job => job.status === 'queued' || job.status === 'processing',
      ),
    [jobs],
  );

  /**
   * При входе на экран подтягиваем задачи с сервера.
   * Если экран был закрыт и открыт снова — активные задачи не пропадут.
   */
  useEffect(() => {
    getMyHistoryJobs()
      .then(setJobs)
      .catch(err => {
        console.log('Не удалось получить список задач:', err.message);
      });
  }, [setJobs]);

  /**
   * Polling активных задач.
   * completed / failed больше не опрашиваем.
   */
  useEffect(() => {
    if (activeJobs.length === 0) return;

    const intervalId = setInterval(() => {
      activeJobs.forEach(job => {
        getHistoryJobStatus(job.id)
          .then(freshJob => {
            const wasActive =
              job.status === 'queued' || job.status === 'processing';

            upsertJob(freshJob);

            if (wasActive && freshJob.status === 'completed') {
              Toast.show({
                type: 'success',
                text1: 'История готова ✅',
                text2: getJobTitle(freshJob),
              });
            }

            if (wasActive && freshJob.status === 'failed') {
              Toast.show({
                type: 'error',
                text1: 'История не создалась',
                text2: freshJob.error || 'Попробуйте ещё раз',
              });
            }
          })
          .catch(err => {
            console.log('Job status check failed:', err.message);
          });
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [activeJobs, upsertJob]);

  const handleGenerate = async () => {
    if (!title.trim()) return;

    setGenerating(true);
    Keyboard.dismiss();

    try {
      const data = await submitGPTHistory(title);
      setTitle(data.generatedHistory);

      Toast.show({
        type: 'success',
        text1: 'Текст сгенерирован ✨',
        text2: 'Теперь вы можете его отредактировать',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка генерации',
        text2: err.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) return;

    setLoading(true);
    Keyboard.dismiss();

    try {
      const job = await addHistory(title.trim());

      upsertJob(job);
      setStatusExpanded(true);
      setTitle('');

      Toast.show({
        type: 'info',
        text1: 'История добавлена в очередь 🚀',
        text2: 'Можно добавить ещё одну историю',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка при отправке',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderJobStatusText = (status: HistoryJobStatus) => {
    if (status === 'queued') return 'В очереди';
    if (status === 'processing') return 'Создаётся';
    if (status === 'completed') return 'Готово';
    return 'Ошибка';
  };

  const renderStepIcon = (status: HistoryJobStepStatus) => {
    if (status === 'completed') return '✅';
    if (status === 'processing') return '⏳';
    if (status === 'failed') return '❌';
    return '○';
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: appTheme.colors.text }]}>
        Создание истории
      </Text>

      {jobs.length > 0 && (
        <View style={styles.statusPanel}>
          <TouchableOpacity
            style={styles.statusHeader}
            onPress={toggleStatusExpanded}
          >
            <View>
              <Text style={styles.statusTitle}>
                Создание историй: {jobs.length}
              </Text>

              <Text style={styles.statusSubtitle}>
                Активных: {activeJobs.length}
              </Text>
            </View>

            <Text style={styles.statusToggle}>
              {statusExpanded ? 'Свернуть ▲' : 'Развернуть ▼'}
            </Text>
          </TouchableOpacity>

          {statusExpanded && (
            <>
              {jobs.map(job => (
                <View key={job.id} style={styles.jobCard}>
                  <Text style={styles.jobPreview}>{getJobTitle(job)}</Text>

                  <Text style={styles.jobStatus}>
                    {renderJobStatusText(job.status)} — {job.progress}%
                  </Text>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${job.progress}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.stepsWrapper}>
                    {job.steps.map(step => (
                      <View key={step.key} style={styles.stepRow}>
                        <Text style={styles.stepIcon}>
                          {renderStepIcon(step.status)}
                        </Text>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.stepTitle}>{step.title}</Text>

                          {step.error ? (
                            <Text style={styles.jobError}>{step.error}</Text>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>

                  {job.error ? (
                    <Text style={styles.jobError}>{job.error}</Text>
                  ) : null}
                </View>
              ))}

              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFinishedJobs}
              >
                <Text style={styles.clearButtonText}>Очистить завершённые</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Напишите тему или вставьте свой текст..."
          placeholderTextColor="#888"
          value={title}
          onChangeText={text => setTitle(text.slice(0, 4000))}
          multiline
          textAlignVertical="top"
          style={[
            styles.input,
            {
              color: appTheme.colors.text,
              borderColor: appTheme.colors.border,
              backgroundColor: appTheme.colors.card,
            },
          ]}
        />

        <TouchableOpacity
          style={[
            styles.generateIcon,
            { backgroundColor: appTheme.colors.primary },
          ]}
          onPress={handleGenerate}
          disabled={generating || !title.trim()}
        >
          {generating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="flash" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>{title.length} знаков</Text>

      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: title.trim().length > 10 ? '#28a745' : '#555' },
        ]}
        onPress={handleAdd}
        disabled={loading || title.trim().length < 10}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Запустить создание истории</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getJobTitle(job: HistoryJob): string {
  return `История ${job.id.slice(0, 8)}`;
}

const styles = StyleSheet.create({
  container: { padding: 20, minHeight: height },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusPanel: {
    backgroundColor: '#242424',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  statusSubtitle: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 3,
  },
  statusToggle: {
    color: '#ff9800',
    fontSize: 12,
  },
  jobCard: {
    marginTop: 12,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
  },
  jobPreview: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600',
  },
  jobStatus: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#555',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#28a745',
  },
  stepsWrapper: {
    marginTop: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stepIcon: {
    width: 24,
    color: '#fff',
    fontSize: 13,
  },
  stepTitle: {
    color: '#ddd',
    fontSize: 12,
  },
  jobError: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  clearButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#444',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ddd',
    fontSize: 12,
  },
  inputWrapper: { position: 'relative' },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    paddingTop: 15,
    height: height / 2.2,
    fontSize: 16,
    lineHeight: 22,
  },
  generateIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    textAlign: 'right',
    marginBottom: 15,
    color: '#888',
    fontSize: 12,
  },
  addButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  backButton: { padding: 16, borderRadius: 16, alignItems: 'center' },
  backButtonText: { color: '#888', fontSize: 16 },
});
