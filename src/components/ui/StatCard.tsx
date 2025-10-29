// src/components/ui/StatCard.tsx
import { Card, Group, Text, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = 'blue' }) => {
  const TrendIcon = trend === 'up' ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Card withBorder p="lg" radius="md">
      <Group position="apart">
        <div>
          <Text color="dimmed" transform="uppercase" weight={700} size="xs">
            {title}
          </Text>
          <Text weight={700} size="xl">
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size={36} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      {trend && (
        <Group spacing="xs" mt="md">
          <TrendIcon size={16} style={{ color: trend === 'up' ? 'teal' : 'red' }} />
          <Text color={trend === 'up' ? 'teal' : 'red'} size="sm" weight={500}>
            +15%
          </Text>
          <Text size="sm" color="dimmed">
            vs last month
          </Text>
        </Group>
      )}
    </Card>
  );
};

export default StatCard;
