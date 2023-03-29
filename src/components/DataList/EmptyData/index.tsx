import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { CgFeed } from 'react-icons/cg';

const EmptyData = () => {
  return (
    <Box>
      <Flex
        direction="column"
        mt="10"
        justifyContent="center"
        alignItems="center"
      >
        <CgFeed fontSize={120} />
        <Text fontSize={20}>No post yet</Text>
      </Flex>
    </Box>
  );
};
export default EmptyData;
