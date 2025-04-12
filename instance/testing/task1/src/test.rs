#[allow(unused_imports)]
use crate::{LinkedList, LinkedListNode};

impl LinkedList {
    /// Put item onto the front of the linked list
    fn push_front(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
    }

    fn from_slice(s: &[i32]) -> Self {
        let mut l = Self::new();
        for val in s.iter().rev() {
            l.push_front(*val);
        }
        return l
    }

    /// Utility for testing so I can use vec comparison
    pub fn as_vec(&self) -> Vec<i32> {
        let mut ret = vec![];
        let mut node = &self.head;
        loop {
            match &node {
                None => return ret,
                Some(n) => {
                    ret.push(n.val);
                    node = &n.next;
                }
            }
        }
    }
}


pub fn run_tests() {
    let mut results = vec![];
    results.push(insert_empty_list_tests());
    results.push(insert_head_tests());
    results.push(insert_tail_tests());
    results.push(insert_mid_tests());
    results.push(insert_out_of_bounds_tests());

    println!();
    for result in results {
        println!("{result}");
    }
}



fn insert_empty_list_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_empty_list_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::new();
    match l.insert(5, 0) {
        Ok(_) => {
            let expected = vec![5];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: [].insert(5, 0)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: [].insert(5, 0)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::new();
    match l.insert(-3, 0) {
        Ok(_) => {
            let expected = vec![-3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: [].insert(-3, 0)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: [].insert(-3, 0)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    // Test 3: Insert at index 1 in empty list (should fail)
    let mut l = LinkedList::new();
    match l.insert(42, 1) {
        Ok(_) => {
            println!("Test 3 FAILED: [].insert(41, 1)");
            println!("\tExpected error");
            println!("\tGot: {:?}", l.as_vec());
            all_passed = false;
        },
        Err(_) => {}
    }

    // Test 4: Insert at high index (10) in empty list (should fail)
    let mut l = LinkedList::new();
    match l.insert(99, 10) {
        Ok(_) => {
            println!("Test 4 FAILED: [].insert(99, 10)");
            println!("\tExpected error");
            println!("\tGot: {:?}", l.as_vec());
            all_passed = false;
        },
        Err(_) => {}
    }

    println!("Finished");
    if all_passed {
        "insert_empty_list_tests: PASSED"
    } else {
        "insert_empty_list_tests: FAILED"
    }
}


fn insert_head_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_head_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::new();
    match l.insert(1, 0) {
        Ok(_) => {
            let expected = vec![1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: [].insert(1, 0)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: [].insert(1, 0)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1]);
    match l.insert(2, 0) {
        Ok(_) => {
            let expected = vec![2, 1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: [1].insert(2, 0)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: [1].insert(2, 0)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[2, 1]);
    match l.insert(5, 0) {
        Ok(_) => {
            let expected = vec![5, 2, 1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 3 FAILED: [2, 1].insert(5, 0)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 3 FAILED: [2, 1].insert(5, 0)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }


    println!("Finished");
    if all_passed {
        "insert_head_tests: PASSED"
    } else {
        "insert_head_tests: FAILED"
    }
}



fn insert_tail_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_tail_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::new();
    match l.insert(1, 0) {
        Ok(_) => {
            let expected = vec![1];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: [].insert(1, 0)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: [].insert(1, 0)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1]);
    match l.insert(2, 1) {
        Ok(_) => {
            let expected = vec![1, 2];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: [1].insert(2, 1)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: [1].insert(2, 1)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1, 2]);
    match l.insert(-3, 2) {
        Ok(_) => {
            let expected = vec![1, 2, -3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 3 FAILED: [1, 2].insert(-3, 2)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 3 FAILED: [1, 2].insert(-3, 2)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }


    println!("Finished");
    if all_passed {
        "insert_tail_tests: PASSED"
    } else {
        "insert_tail_tests: FAILED"
    }
}



fn insert_mid_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_mid_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::from_slice(&[1, 2, 3]);

    match l.insert(10, 2) {
        Ok(_) => {
            let expected = vec![1, 2, 10, 3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 1 FAILED: [1, 2, 3].insert(10, 2)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 1 FAILED: [1, 2, 3].insert(10, 2)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }

    let mut l = LinkedList::from_slice(&[1, 2, 10, 3]);
    match l.insert(-5, 1) {
        Ok(_) => {
            let expected = vec![1,-5, 2, 10, 3];
            let actual = l.as_vec();
            if actual != expected {
                println!("Test 2 FAILED: [1, 2, 10, 3].insert(-5, 1)");
                println!("\t{:<12}{expected:?}","Expected:");
                println!("\t{:<12}{actual:?}","Got:");
                all_passed = false;
            }
        },
        Err(e) => {
            println!("Test 2 FAILED: [1, 2, 10, 3].insert(-5, 1)");
            println!("\tError: {:?}", e);
            all_passed = false;
        }
    }


    println!("Finished");
    if all_passed {
        "insert_mid_tests: PASSED"
    } else {
        "insert_mid_tests: FAILED"
    }
}


fn insert_out_of_bounds_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING insert_out_of_bounds_tests TESTS "));
    let mut all_passed = true;


    let mut l = LinkedList::from_slice(&[1]);

    let result = l.insert(2, 2); // invalid index
    if result.is_ok() {
        println!("Test 1 FAILED: [1].insert(2, 2)");
        println!("\tExpected error");
        println!("\tGot: {:?}", l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1]);
    let result = l.insert(5, 100); // invalid index
    if result.is_ok() {
        println!("Test 1 FAILED: [1].insert(5, 100)");
        println!("\tExpected error");
        println!("\tGot: {:?}", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "insert_out_of_bounds_tests: PASSED"
    } else {
        "insert_out_of_bounds_tests: FAILED"
    }
}
