import { useNavigate } from 'react-router-dom';
import MaintenanceScreen from '../components/MaintenanceScreen.jsx';

export default function MaintenancePage() {
  const navigate = useNavigate();
  return (
    <MaintenanceScreen
      title="Alit временно недоступен"
      message="Извините, но, к сожалению, сейчас ведутся технические работы. Пожалуйста, попробуйте зайти позже."
      onRetry={() => navigate('/chat')}
    />
  );
}
