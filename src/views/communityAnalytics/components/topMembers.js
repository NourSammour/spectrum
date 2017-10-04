import * as React from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import { UserListItem } from '../../../components/listItems';
import { SectionCard, SectionSubtitle, SectionTitle } from '../style';
import { getCommunityTopMembers } from '../queries';

type User = {
  id: string,
  profilePhoto: string,
  name: string,
  username: string,
};

type Props = {
  isLoading: boolean,
  data: {
    community: {
      topMembers: Array<User>,
    },
  },
};

class ConversationGrowth extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading } = this.props;

    if (community && community.topMembers.length > 0) {
      return (
        <SectionCard>
          <SectionSubtitle>Top members this week</SectionSubtitle>
          {community.topMembers.map(user => {
            return <UserListItem key={user.id} user={user} />;
          })}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <SectionSubtitle>Top members this week</SectionSubtitle>
        <ViewError
          small
          emoji={'😭'}
          heading={`Your community has been quiet this week`}
          subheading={`When people are posting new threads and joining conversations, the most active people will appear here.`}
        />
      </SectionCard>
    );
  }
}

export default compose(getCommunityTopMembers, viewNetworkHandler, pure)(
  ConversationGrowth
);