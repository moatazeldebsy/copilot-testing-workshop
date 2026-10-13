import MDXComponents from '@theme-original/MDXComponents';
import ArchDiagram from '@site/src/components/ArchDiagram';
import Collapsible from '@site/src/components/Collapsible';
import ExerciseRepoCallout from '@site/src/components/ExerciseRepoCallout';
import PageMeta from '@site/src/components/PageMeta';
import PollBlock from '@site/src/components/PollBlock';
import TimedExercise from '@site/src/components/TimedExercise';
import VerifyBlock from '@site/src/components/VerifyBlock';

// Workshop components are available in every MDX page without imports.
export default {
  ...MDXComponents,
  ArchDiagram,
  Collapsible,
  ExerciseRepoCallout,
  PageMeta,
  PollBlock,
  TimedExercise,
  VerifyBlock,
};
