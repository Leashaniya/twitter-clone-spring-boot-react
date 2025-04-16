import React from 'react'
import { List, ListItem, ListItemText, Typography } from '@mui/material'

const trendingSkills = [
    {
        category: 'Trending Skills',
        title: '#MachineLearning',
        learners: '12.5K Learners'
    },
    {
        category: 'Popular Topic',
        title: '#DataScience',
        learners: '8.3K Discussions'
    },
    {
        category: 'New Course',
        title: '#CloudComputing',
        learners: '5.2K Enrolled'
    }
]

const TrendingSkills = () => {
    return (
        <List className="bg-[#16181c] rounded-lg">
            {trendingSkills.map((skill, index) => (
                <ListItem key={index} className="hover:bg-gray-800 cursor-pointer">
                    <ListItemText
                        primary={
                            <Typography variant="body2" color="textSecondary">
                                {skill.category}
                            </Typography>
                        }
                        secondary={
                            <>
                                <Typography variant="subtitle1" className="font-bold text-white">
                                    {skill.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {skill.learners}
                                </Typography>
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    )
}

export default TrendingSkills 