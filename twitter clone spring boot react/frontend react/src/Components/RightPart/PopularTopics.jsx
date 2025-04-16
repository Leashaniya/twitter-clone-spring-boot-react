import React from 'react'
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material'

const popularTopics = [
    {
        title: 'Web Development',
        tags: ['React', 'Node.js', 'JavaScript'],
        discussions: '15.2K'
    },
    {
        title: 'Mobile Development',
        tags: ['Flutter', 'React Native'],
        discussions: '10.8K'
    },
    {
        title: 'Data Science',
        tags: ['Python', 'R', 'SQL'],
        discussions: '12.3K'
    }
]

const PopularTopics = () => {
    return (
        <List className="bg-[#16181c] rounded-lg">
            <ListItem>
                <Typography variant="h6" className="text-white font-bold">
                    Popular Topics
                </Typography>
            </ListItem>
            {popularTopics.map((topic, index) => (
                <ListItem key={index} className="hover:bg-gray-800 cursor-pointer flex-col items-start">
                    <ListItemText
                        primary={
                            <Typography variant="subtitle1" className="font-bold text-white">
                                {topic.title}
                            </Typography>
                        }
                        secondary={
                            <>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {topic.tags.map((tag, idx) => (
                                        <Chip
                                            key={idx}
                                            label={tag}
                                            size="small"
                                            className="bg-[#1d9bf0] text-white"
                                        />
                                    ))}
                                </div>
                                <Typography variant="body2" color="textSecondary" className="mt-2">
                                    {topic.discussions} Discussions
                                </Typography>
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    )
}

export default PopularTopics 