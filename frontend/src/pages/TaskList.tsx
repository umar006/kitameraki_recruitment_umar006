import { PrimaryButton } from '@fluentui/react/lib/Button';
import { List } from '@fluentui/react/lib/List';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { ITheme, mergeStyleSets, normalize } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';
import { UseQueryResult } from '@tanstack/react-query';
import { Task } from '../types/task';

const generateStyles = (theme: ITheme) => {
  return mergeStyleSets({
    container: {
      overflow: 'auto',
      maxHeight: 512,
      maxWidth: 512,
      border: '1px solid ' + theme.palette.neutralLight,
      marginTop: 24,
      selectors: {
        '.ms-List-cell': {
          height: 52,
          lineHeight: 52,
          textOverflow: 'clip',
          background: theme.palette.neutralLighter,
          borderBottom: '2px solid white',
        },
      },
    },
    itemContent: [
      normalize,
      {
        paddingLeft: 16,
        paddingRight: 16,
        whiteSpace: 'wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    ],
  });
};

const stackStyles: IStackTokens = {
  childrenGap: 8,
  padding: 8,
};

interface TaskListProps {
  queryTasks: UseQueryResult<Task[], Error>;
}

export default function TaskList({ queryTasks }: TaskListProps) {
  const theme = useTheme();
  const { data, isLoading } = queryTasks;

  if (isLoading) return 'Loading...';

  const onRenderCell = (task?: Task) => {
    return (
      <div>
        <Stack horizontal horizontalAlign="space-between">
          <div className={generateStyles(theme).itemContent}>
            <span>{task?.title}</span>
          </div>
          <Stack.Item align="center">
            <Stack horizontal tokens={stackStyles}>
              <PrimaryButton text="edit" />
              <PrimaryButton text="delete" />
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    );
  };

  return (
    <div className={generateStyles(theme).container}>
      <List items={data} onRenderCell={onRenderCell} />
    </div>
  );
}
